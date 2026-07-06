import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const LOVABLE_AI_KEY = Deno.env.get('LOVABLE_API_KEY') ?? '';
const LOVABLE_AI_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
const VISION_MODEL = 'google/gemini-3-flash-preview';
const MAX_VISION_PER_RUN = 40; // cap thumbnail OCR to control cost

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
  // Formats
  'anime episode', 'anime full episode', 'anime scene', 'anime clip',
  'anime moment', 'anime fight scene', 'anime best moments',
  'anime opening', 'anime ending', 'anime OP', 'anime ED',
  'anime AMV', 'anime edit', 'anime trailer', 'anime PV',
  'manga anime scene', 'manga trailer', 'manga PV',
  // Genres / demographics
  'shonen anime', 'seinen anime', 'shojo anime', 'isekai anime',
  'mecha anime', 'slice of life anime', 'romance anime',
  'horror anime', 'sports anime', 'fantasy anime',
  // Franchises (broad, drives volume)
  'naruto amv', 'naruto scene', 'one piece scene', 'one piece amv',
  'bleach scene', 'bleach amv', 'dragon ball scene', 'dragon ball amv',
  'attack on titan scene', 'attack on titan amv', 'demon slayer scene',
  'demon slayer amv', 'jujutsu kaisen scene', 'jujutsu kaisen amv',
  'my hero academia scene', 'my hero academia amv', 'hunter x hunter scene',
  'chainsaw man scene', 'spy x family scene', 'jojo scene', 'jojo amv',
  'fullmetal alchemist scene', 'death note scene', 'tokyo revengers scene',
  'black clover scene', 'fairy tail scene', 'sword art online scene',
  'evangelion scene', 'gintama scene', 'mob psycho scene', 'vinland saga scene',
  'made in abyss scene', 'code geass scene', 'steins gate scene',
  'haikyuu scene', 'kaiju no 8 scene', 'frieren scene', 'dandadan scene',
  // Language variants — VOSTFR/VF/dub keeps pulling fresh content
  'anime vostfr', 'anime vf', 'anime episode vostfr', 'anime sub español',
  'anime dub english', 'アニメ 名場面', 'アニメ OP', 'アニメ ED',
];

// Words that strongly indicate commentator / streamer / reaction content — NOT anime footage.
const BLOCK_WORDS = [
  'reaction', 'reacts', 'react to', 'reacting',
  'commentary', 'commentator', 'commenting',
  'podcast', 'talk show', 'interview',
  'stream', 'streamer', 'streaming', 'livestream', 'live stream',
  'twitch', 'vlog', 'q&a', 'q and a',
  'tier list', 'tierlist', 'ranking', 'ranks',
  'top 10', 'top10', 'top 5', 'top5',
  'discussion', 'debate', 'rant',
  'face cam', 'facecam', 'webcam',
  'gameplay', "let's play", 'lets play', 'walkthrough',
  'analysis by', 'explained by', 'react ',
 ];

// Words that confirm the video is anime / manga animated content.
const REQUIRE_ANY = [
  'anime', 'manga', 'アニメ', 'マンガ', 'opening', 'ending', 'op ', 'ed ',
  'amv', 'trailer', 'pv', 'episode', 'ep.', 'ep ', 'scene', 'fight',
  'sub', 'dub', 'vostfr', 'vf', 'shonen', 'seinen', 'shojo', 'isekai',
];

function isAnimeVideo(
  title: string, desc: string, channel: string,
  tags: string[] = [], extraKeywords: string[] = [],
): boolean {
  const hay = `${title}\n${desc}\n${channel}\n${tags.join(' ')}`.toLowerCase();
  for (const b of BLOCK_WORDS) if (hay.includes(b)) return false;
  for (const k of extraKeywords) if (k && hay.includes(k.toLowerCase())) return false;
  for (const r of REQUIRE_ANY) if (hay.includes(r)) return true;
  return false;
}

/**
 * Ask a vision LLM whether this YouTube thumbnail shows a real human commentator /
 * streamer / reactor (webcam overlay, face cam, podcast host, etc.) rather than
 * pure animated anime/manga content. Returns { commentator: boolean, reason?: string }.
 */
async function analyseThumbnail(imageUrl: string): Promise<{ commentator: boolean; reason?: string } | null> {
  if (!LOVABLE_AI_KEY) return null;
  try {
    const res = await fetch(LOVABLE_AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': LOVABLE_AI_KEY,
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You classify YouTube thumbnails. Reply strict JSON only: ' +
              '{"commentator": boolean, "reason": string}. ' +
              '"commentator" is true when the thumbnail shows a real human face ' +
              '(webcam overlay, face cam, streamer, reactor, podcast host, ' +
              'YouTuber pointing/screaming at the camera, tier-list host, ' +
              'commentary/analysis creator). ' +
              'Also true if OCR text on the thumbnail contains words like ' +
              'REACTION, REACT, TIER LIST, TOP 10, PODCAST, EXPLAINED, STREAM, ' +
              'REACTS TO, RANKING, RANT, TALK. ' +
              'False when the thumbnail shows only anime/manga artwork, ' +
              'characters, animated scenes, opening/ending stills.',
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Classify this YouTube thumbnail.' },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const j = await res.json();
    const raw = j.choices?.[0]?.message?.content ?? '{}';
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return { commentator: !!parsed.commentator, reason: parsed.reason };
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const apiKey = Deno.env.get('YOUTUBE_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'YOUTUBE_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const SYNC_KEY = 'youtube-manga';

  try {
    // ---- POST action: add entries to the persistent blacklist ---------------
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const bl = (body as any)?.blacklist;
      if (bl && (Array.isArray(bl.videoIds) || Array.isArray(bl.keywords))) {
        const rows: { kind: string; value: string; reason?: string }[] = [];
        for (const v of bl.videoIds ?? []) {
          if (typeof v === 'string' && v.trim()) rows.push({ kind: 'video_id', value: v.trim(), reason: bl.reason });
        }
        for (const k of bl.keywords ?? []) {
          if (typeof k === 'string' && k.trim()) rows.push({ kind: 'keyword', value: k.trim().toLowerCase(), reason: bl.reason });
        }
        if (rows.length) {
          await admin
            .from('youtube_blacklist')
            .upsert(rows, { onConflict: 'kind,value', ignoreDuplicates: true });
          // Hide any stored videos that match.
          if (bl.videoIds?.length) {
            await admin
              .from('youtube_manga_videos')
              .update({ is_hidden: true })
              .in('video_id', bl.videoIds);
          }
          if (bl.keywords?.length) {
            for (const k of bl.keywords) {
              const like = `%${String(k).toLowerCase()}%`;
              await admin
                .from('youtube_manga_videos')
                .update({ is_hidden: true })
                .or(`title.ilike.${like},description.ilike.${like},channel_title.ilike.${like}`);
            }
          }
        }
        return new Response(JSON.stringify({ ok: true, added: rows.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      // Fall through to sync flow if no blacklist payload.
    }

    // ---- Load persistent blacklist (video ids + keywords) -------------------
    const { data: blRows } = await admin
      .from('youtube_blacklist')
      .select('kind, value');
    const blockedIds = new Set<string>();
    const blockedKeywords: string[] = [];
    for (const r of blRows ?? []) {
      if (r.kind === 'video_id') blockedIds.add(r.value);
      else if (r.kind === 'keyword') blockedKeywords.push(r.value);
    }

    const url = new URL(req.url);
    const pages = Math.min(Number(url.searchParams.get('pages') ?? 8), 20);
    const customQ = url.searchParams.get('q');
    const order = url.searchParams.get('order') ?? 'date';
    const queries = customQ ? [customQ] : DEFAULT_QUERIES;
    const reset = url.searchParams.get('reset') === '1';

    // Read cursor from DB (last processed publishedAt).
    let cursorIso: string | null = null;
    if (!reset) {
      const { data: state } = await admin
        .from('youtube_sync_state')
        .select('last_published_at')
        .eq('key', SYNC_KEY)
        .maybeSingle();
      cursorIso = (state?.last_published_at as string | null) ?? null;
    }

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
        // Only fetch videos published after the cursor to avoid duplicates.
        if (cursorIso) params.set('publishedAfter', cursorIso);
        if (pageToken) params.set('pageToken', pageToken);
        const r = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
        if (!r.ok) break;
        const j = await r.json();
        for (const it of j.items ?? []) {
          const vid = it.id?.videoId;
          if (vid && !blockedIds.has(vid)) ids.add(vid);
        }
        if (!j.nextPageToken) break;
        pageToken = j.nextPageToken;
      }
    }

    if (ids.size === 0) {
      // Return whatever is already stored (oldest → newest).
      const { data: stored } = await admin
        .from('youtube_manga_videos')
        .select('*')
        .eq('is_hidden', false)
        .order('published_at', { ascending: true })
        .limit(2000);
      return new Response(JSON.stringify({ videos: mapRows(stored ?? []), inserted: 0, cursor: cursorIso }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Also drop IDs we've already analysed with vision — no need to rerun OCR.
    const idArrAll = Array.from(ids);
    const { data: knownRows } = await admin
      .from('youtube_manga_videos')
      .select('video_id, vision_checked')
      .in('video_id', idArrAll);
    const alreadyVisionChecked = new Set<string>(
      (knownRows ?? []).filter((r: any) => r.vision_checked).map((r: any) => r.video_id),
    );

    // 2) Batch videos.list to get durations, filter Shorts and < 60s.
    const idArr = idArrAll;
    const videos: Video[] = [];
    const visionBlacklistAdds: { kind: string; value: string; reason: string }[] = [];
    let visionBudget = MAX_VISION_PER_RUN;
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
        const title = it.snippet?.title ?? '';
        const description = it.snippet?.description ?? '';
        const channelTitle = it.snippet?.channelTitle ?? '';
        const tags: string[] = it.snippet?.tags ?? [];
        if (!isAnimeVideo(title, description, channelTitle, tags, blockedKeywords)) continue;
        const thumbs = it.snippet?.thumbnails ?? {};
        const thumbnail =
          thumbs.maxres?.url || thumbs.standard?.url || thumbs.high?.url || thumbs.medium?.url ||
          thumbs.default?.url || `https://i.ytimg.com/vi/${it.id}/hqdefault.jpg`;

        // Vision OCR / face-detection pass — only for videos not yet checked.
        let visionVerdict: string | null = null;
        let visionRan = false;
        if (visionBudget > 0 && !alreadyVisionChecked.has(it.id)) {
          visionBudget--;
          const verdict = await analyseThumbnail(thumbnail);
          if (verdict) {
            visionRan = true;
            visionVerdict = verdict.commentator
              ? `commentator:${verdict.reason ?? ''}`.slice(0, 200)
              : `ok:${verdict.reason ?? ''}`.slice(0, 200);
            if (verdict.commentator) {
              visionBlacklistAdds.push({
                kind: 'video_id',
                value: it.id,
                reason: `vision:${verdict.reason ?? 'commentator'}`.slice(0, 200),
              });
              continue; // do not include this video
            }
          }
        }

        videos.push({
          id: it.id,
          title,
          description,
          thumbnail,
          channelTitle,
          publishedAt: it.snippet?.publishedAt ?? '',
          durationSec,
          viewCount: Number(it.statistics?.viewCount ?? 0),
          // @ts-ignore — carried through to the DB row below.
          _visionRan: visionRan,
          _visionVerdict: visionVerdict,
        } as any);
      }
    }

    // Sort by publishedAt ASC — oldest → newest.
    videos.sort((a, b) => (a.publishedAt < b.publishedAt ? -1 : 1));

    // Persist vision-based blacklist additions.
    if (visionBlacklistAdds.length) {
      await admin
        .from('youtube_blacklist')
        .upsert(visionBlacklistAdds, { onConflict: 'kind,value', ignoreDuplicates: true });
    }

    // Upsert into DB (video_id is PK → no duplicates).
    if (videos.length) {
      const rows = videos.map((v: any) => ({
        video_id: v.id,
        title: v.title,
        description: v.description,
        thumbnail: v.thumbnail,
        channel_title: v.channelTitle,
        published_at: v.publishedAt,
        duration_sec: v.durationSec,
        view_count: v.viewCount,
        vision_checked: !!v._visionRan,
        vision_verdict: v._visionVerdict ?? null,
      }));
      // Chunk upserts to stay safe.
      for (let i = 0; i < rows.length; i += 500) {
        await admin
          .from('youtube_manga_videos')
          .upsert(rows.slice(i, i + 500), { onConflict: 'video_id', ignoreDuplicates: false });
      }

      // Advance cursor to the newest publishedAt we just processed.
      const newest = videos[videos.length - 1].publishedAt;
      const prev = cursorIso ?? '';
      const nextCursor = newest > prev ? newest : cursorIso;
      await admin
        .from('youtube_sync_state')
        .upsert(
          { key: SYNC_KEY, last_published_at: nextCursor, last_run_at: new Date().toISOString() },
          { onConflict: 'key' },
        );
    } else {
      await admin
        .from('youtube_sync_state')
        .upsert(
          { key: SYNC_KEY, last_published_at: cursorIso, last_run_at: new Date().toISOString() },
          { onConflict: 'key' },
        );
    }

    // Return the full stored list (oldest → newest) so the UI is consistent.
    const { data: stored } = await admin
      .from('youtube_manga_videos')
      .select('*')
      .eq('is_hidden', false)
      .order('published_at', { ascending: true })
      .limit(2000);

    return new Response(
      JSON.stringify({
        videos: mapRows(stored ?? []),
        inserted: videos.length,
        visionBlocked: visionBlacklistAdds.length,
        cursor: cursorIso,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function mapRows(rows: any[]): Video[] {
  return rows.map((r) => ({
    id: r.video_id,
    title: r.title ?? '',
    description: r.description ?? '',
    thumbnail: r.thumbnail ?? `https://i.ytimg.com/vi/${r.video_id}/hqdefault.jpg`,
    channelTitle: r.channel_title ?? '',
    publishedAt: r.published_at ?? '',
    durationSec: Number(r.duration_sec ?? 0),
    viewCount: Number(r.view_count ?? 0),
  }));
}