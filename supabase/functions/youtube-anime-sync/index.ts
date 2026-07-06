import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Parses ISO-8601 duration (PT#H#M#S) to seconds.
function isoToSeconds(iso: string): number {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;
  const h = Number(m[1] ?? 0), mn = Number(m[2] ?? 0), s = Number(m[3] ?? 0);
  return h * 3600 + mn * 60 + s;
}

type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  durationSec: number;
  viewCount: number;
};

const DEFAULT_QUERIES = [
  'anime',
  'manga',
  'anime opening',
  'anime AMV',
  'anime review',
  'manga review',
  'anime trailer',
  'anime analysis',
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const apiKey = Deno.env.get('YOUTUBE_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'YOUTUBE_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(req.url);
    const pages = Math.min(Number(url.searchParams.get('pages') ?? 2), 5);
    const customQ = url.searchParams.get('q');
    const order = url.searchParams.get('order') ?? 'date'; // 'date' | 'viewCount' | 'relevance'
    const queries = customQ ? [customQ] : DEFAULT_QUERIES;

    // 1) Collect candidate video IDs via search.list
    const ids = new Set<string>();
    for (const q of queries) {
      let pageToken: string | undefined;
      for (let p = 0; p < pages; p++) {
        const params = new URLSearchParams({
          key: apiKey,
          part: 'snippet',
          type: 'video',
          maxResults: '50',
          q,
          order,
          videoDuration: 'medium', // 4-20 min — already excludes Shorts
          safeSearch: 'moderate',
          relevanceLanguage: 'fr',
        });
        if (pageToken) params.set('pageToken', pageToken);
        const r = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
        if (!r.ok) break;
        const j = await r.json();
        for (const it of j.items ?? []) {
          if (it.id?.videoId) ids.add(it.id.videoId);
        }
        if (!j.nextPageToken) break;
        pageToken = j.nextPageToken;
      }
    }

    if (ids.size === 0) {
      return new Response(JSON.stringify({ videos: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2) Batch videos.list to get durations, filter Shorts and < 60s.
    const idArr = Array.from(ids);
    const videos: Video[] = [];
    for (let i = 0; i < idArr.length; i += 50) {
      const chunk = idArr.slice(i, i + 50);
      const params = new URLSearchParams({
        key: apiKey,
        part: 'snippet,contentDetails,statistics',
        id: chunk.join(','),
      });
      const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);
      if (!r.ok) continue;
      const j = await r.json();
      for (const it of j.items ?? []) {
        const durationSec = isoToSeconds(it.contentDetails?.duration ?? '');
        if (durationSec < 61) continue; // exclude Shorts + < 1 min
        const thumbs = it.snippet?.thumbnails ?? {};
        videos.push({
          id: it.id,
          title: it.snippet?.title ?? '',
          description: it.snippet?.description ?? '',
          thumbnail:
            thumbs.maxres?.url || thumbs.standard?.url || thumbs.high?.url || thumbs.medium?.url ||
            thumbs.default?.url || `https://i.ytimg.com/vi/${it.id}/hqdefault.jpg`,
          channelTitle: it.snippet?.channelTitle ?? '',
          publishedAt: it.snippet?.publishedAt ?? '',
          durationSec,
          viewCount: Number(it.statistics?.viewCount ?? 0),
        });
      }
    }

    // Sort by publishedAt desc
    videos.sort((a, b) => (b.publishedAt < a.publishedAt ? -1 : 1));

    return new Response(JSON.stringify({ videos, count: videos.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});