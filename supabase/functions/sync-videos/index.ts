import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const YT_HANDLE = 'animemomentsanimeofficiel';

// Series blocked from being imported / displayed
const BLOCKED_KEYWORDS = ['otaku ni yasashii', 'mahou shoujo', 'madoka magica', 'madoka'];

function isBlocked(text: string | null | undefined): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  return BLOCKED_KEYWORDS.some((k) => t.includes(k));
}

type Row = {
  source: 'youtube' | 'tiktok' | 'prime';
  external_id: string;
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  video_url: string;
  published_at?: string | null;
};

async function fetchYouTube(apiKey: string): Promise<Row[]> {
  // 1. Resolve channel by handle -> uploads playlist id
  const chRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=@${YT_HANDLE}&key=${apiKey}`,
  );
  const chJson = await chRes.json();
  if (!chRes.ok) throw new Error(`YouTube channel error: ${JSON.stringify(chJson)}`);
  const uploadsId = chJson.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) return [];

  // 2. Paginate through ALL uploads (50 per page, up to 10 pages = 500 videos)
  const items: any[] = [];
  let pageToken: string | undefined;
  for (let page = 0; page < 10; page++) {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('playlistId', uploadsId);
    url.searchParams.set('key', apiKey);
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const plRes = await fetch(url.toString());
    const plJson = await plRes.json();
    if (!plRes.ok) throw new Error(`YouTube playlist error: ${JSON.stringify(plJson)}`);
    items.push(...(plJson.items ?? []));
    pageToken = plJson.nextPageToken;
    if (!pageToken) break;
  }

  return items.map((it: any): Row => {
    const sn = it.snippet ?? {};
    const vid = sn.resourceId?.videoId;
    const thumb =
      sn.thumbnails?.maxres?.url ||
      sn.thumbnails?.standard?.url ||
      sn.thumbnails?.high?.url ||
      sn.thumbnails?.medium?.url ||
      `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
    return {
      source: 'youtube',
      external_id: vid,
      title: sn.title ?? 'Sans titre',
      description: sn.description ?? null,
      thumbnail_url: thumb,
      video_url: `https://www.youtube.com/watch?v=${vid}`,
      published_at: sn.publishedAt ?? null,
    };
  }).filter((r) => !isBlocked(r.title) && !isBlocked(r.description));
}

async function fetchTikTok(): Promise<Row[]> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const TIKTOK_API_KEY = Deno.env.get('TIKTOK_API_KEY');
  if (!LOVABLE_API_KEY || !TIKTOK_API_KEY) return [];

  const url =
    'https://connector-gateway.lovable.dev/tiktok/video/list/?fields=id,title,video_description,cover_image_url,share_url,create_time';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      'X-Connection-Api-Key': TIKTOK_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ max_count: 20 }),
  });
  const body = await res.json();
  if (!res.ok) {
    console.error('TikTok gateway error', res.status, body);
    return [];
  }
  const list = body?.data?.videos ?? [];
  return list.map((v: any): Row => ({
    source: 'tiktok',
    external_id: String(v.id),
    title: v.title || v.video_description?.slice(0, 80) || 'TikTok',
    description: v.video_description ?? null,
    thumbnail_url: v.cover_image_url ?? null,
    video_url: v.share_url,
    published_at: v.create_time ? new Date(v.create_time * 1000).toISOString() : null,
  })).filter((r) => !isBlocked(r.title) && !isBlocked(r.description));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const results: { source: string; count: number; error?: string }[] = [];
    const allRows: Row[] = [];

    if (YOUTUBE_API_KEY) {
      try {
        const yt = await fetchYouTube(YOUTUBE_API_KEY);
        allRows.push(...yt);
        results.push({ source: 'youtube', count: yt.length });
      } catch (e) {
        results.push({ source: 'youtube', count: 0, error: String(e) });
      }
    }

    try {
      const tt = await fetchTikTok();
      allRows.push(...tt);
      results.push({ source: 'tiktok', count: tt.length });
    } catch (e) {
      results.push({ source: 'tiktok', count: 0, error: String(e) });
    }

    if (allRows.length > 0) {
      // In-batch dedupe (keep first occurrence of each source+external_id)
      const seen = new Set<string>();
      const deduped = allRows.filter((r) => {
        if (!r.external_id) return true;
        const key = `${r.source}:${r.external_id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const { error } = await supabase
        .from('imported_videos')
        .upsert(deduped, {
          onConflict: 'source,external_id',
          ignoreDuplicates: false,
        });
      if (error) throw error;
      results.push({ source: 'upserted', count: deduped.length });
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('sync-videos failed', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});