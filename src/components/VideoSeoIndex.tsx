import { videos as defaultVideos, thumb, type Video } from "@/data/videos";

/**
 * Emits a JSON-LD graph AND a hidden microdata list of VideoObject nodes with
 * all fields Google requires/recommends (name, description, thumbnailUrl,
 * uploadDate, contentUrl, embedUrl, duration). Drop it on any page that
 * surfaces YouTube videos so Search Console stops flagging missing props.
 */
export default function VideoSeoIndex({
  videos = defaultVideos,
  scope = "site",
}: {
  videos?: Video[];
  scope?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": videos.map((v) => ({
      "@type": "VideoObject",
      name: v.title,
      description: `${v.series} — ${v.channel ?? "AnimemomentsAnimeofficiel"} ${v.episode ?? ""}`.trim(),
      thumbnailUrl: [thumb(v.id)],
      uploadDate: v.date ?? "2026-01-01",
      contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
      embedUrl: `https://www.youtube.com/embed/${v.id}`,
      duration: "PT1M",
      publisher: {
        "@type": "Organization",
        name: "AnimemomentsAnimeofficiel",
        logo: { "@type": "ImageObject", url: "https://lovanet.fr/favicon.png" },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="sr-only" aria-hidden="true">
        <ul>
          {videos.map((v) => (
            <li
              key={`vseo-${scope}-${v.id}`}
              itemScope
              itemType="https://schema.org/VideoObject"
            >
              <a href={`https://www.youtube.com/watch?v=${v.id}`}>
                <img
                  src={thumb(v.id)}
                  alt={`${v.title} — ${v.series}`}
                  itemProp="thumbnailUrl"
                />
                <span itemProp="name">{v.title}</span>
                <span itemProp="description">
                  {v.series} · {v.episode ?? ""}
                </span>
              </a>
              <meta
                itemProp="contentUrl"
                content={`https://www.youtube.com/watch?v=${v.id}`}
              />
              <meta
                itemProp="embedUrl"
                content={`https://www.youtube.com/embed/${v.id}`}
              />
              <meta itemProp="uploadDate" content={v.date ?? "2026-01-01"} />
              <meta itemProp="duration" content="PT1M" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}