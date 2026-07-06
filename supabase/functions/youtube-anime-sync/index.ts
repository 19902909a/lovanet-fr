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
  'anime episode',
  'anime full episode',
  'manga anime scene',
  'anime opening',
  'anime ending',
  'anime AMV',
  'anime trailer',
  'anime clip',
  'anime moment',
  'anime fight scene',
  'shonen anime',
  'seinen anime',
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

function isAnimeVideo(title: string, desc: string, channel: string, tags: string[] = []): boolean {
  const hay = `${title}\n${desc}\n${channel}\n${tags.join(' ')}`.toLowerCase();
  for (const b of BLOCK_WORDS) if (hay.includes(b)) return false;
  for (const r of REQUIRE_ANY) if (hay.includes(r)) return true;
  return false;
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

  try {
    const url = new URL(req.url);
    const pages = Math.min(Number(url.searchParams.get('pages') ?? 8), 20);
    const customQ = url.searchParams.get('q');
    // 'date' returns newest first; we sort ascending (oldest → newest) after fetch.
    const order = url.searchParams.get('order') ?? 'date';
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
        const title = it.snippet?.title ?? '';
        const description = it.snippet?.description ?? '';
        const channelTitle = it.snippet?.channelTitle ?? '';
        const tags: string[] = it.snippet?.tags ?? [];
        if (!isAnimeVideo(title, description, channelTitle, tags)) continue;
        const thumbs = it.snippet?.thumbnails ?? {};
        videos.push({
          id: it.id,
          title,
          description,
          thumbnail:
            thumbs.maxres?.url || thumbs.standard?.url || thumbs.high?.url || thumbs.medium?.url ||
            thumbs.default?.url || `https://i.ytimg.com/vi/${it.id}/hqdefault.jpg`,
          channelTitle,
          publishedAt: it.snippet?.publishedAt ?? '',
          durationSec,
          viewCount: Number(it.statistics?.viewCount ?? 0),
        });
      }
    }

    // Sort by publishedAt ASC — oldest → newest (as requested).
    videos.sort((a, b) => (a.publishedAt < b.publishedAt ? -1 : 1));

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