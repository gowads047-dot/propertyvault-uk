"use client";
import { useState } from "react";
import Image from "next/image";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

// A real YouTube id is 11 chars of [A-Za-z0-9_-]. Several posts still carry the
// literal "YOUTUBE_VIDEO_ID" placeholder, which renders a 404 thumbnail and a dead
// player, so render nothing until a real id is supplied.
const isRealVideoId = (id: string) => /^[A-Za-z0-9_-]{11}$/.test(id);

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  if (!isRealVideoId(videoId)) return null;

  return (
    <div className="not-prose my-8">
      <div className="relative w-full rounded-2xl overflow-hidden bg-navy-900" style={{ aspectRatio: "16/9" }}>
        {loaded ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            onClick={() => setLoaded(true)}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 group cursor-pointer"
            aria-label={`Play: ${title}`}
          >
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover opacity-60"
            />
            <div className="relative z-10 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
              <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="relative z-10 text-white font-semibold text-sm drop-shadow-lg px-4 text-center">{title}</p>
          </button>
        )}
      </div>
    </div>
  );
}
