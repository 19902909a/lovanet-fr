import { thumb, type Video } from "@/data/videos";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";

export const VideoCard = ({ video }: { video: Video }) => (
  <Link
    to={`/lecteurs-video?video=${video.id}`}
    className="group block rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/60 transition-all hover:-translate-y-1"
  >
    <div className="relative aspect-video overflow-hidden">
      <img
        src={thumb(video.id)}
        alt={video.title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.6)]">
          <Play className="w-6 h-6 text-primary-foreground fill-current" />
        </div>
      </div>
      <div className="absolute top-3 left-3 text-[10px] uppercase tracking-wider text-white/90 font-semibold">
        {video.channel}
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
        {video.title}
      </h3>
      <p className="text-xs text-muted-foreground mt-2">{video.series}</p>
    </div>
  </Link>
);