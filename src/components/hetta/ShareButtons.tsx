"use client";

import { useState } from "react";

export function ShareButtons({ title, url }: { title: string; url?: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const text = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <a href={`https://wa.me/?text=${text}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
        style={{ background: "#25D366", color: "white" }}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </a>
      <a href={`https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
        style={{ background: "#FFFC00", color: "#000" }}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.922-.384a.705.705 0 01.51-.21c.27 0 .54.12.69.3.18.22.24.51.15.78-.18.51-.57.9-1.02 1.05a2.83 2.83 0 01-.87.21c-.12.015-.24.03-.36.06-.39.09-.57.36-.51.78.18 1.11-.45 2.16-1.5 2.61a7.09 7.09 0 01-2.19.57c-.45.06-.57.24-.6.36-.12.36-.45.54-.87.54h-.03c-.36 0-.69-.15-.87-.42-.24-.36-.57-.42-.87-.42h-.06c-.3 0-.63.06-.87.42a.92.92 0 01-.87.42h-.03c-.42 0-.75-.18-.87-.54-.03-.12-.15-.3-.6-.36a7.09 7.09 0 01-2.19-.57c-1.05-.45-1.68-1.5-1.5-2.61.06-.42-.12-.69-.51-.78-.12-.03-.24-.045-.36-.06a2.83 2.83 0 01-.87-.21c-.45-.15-.84-.54-1.02-1.05a.81.81 0 01.15-.78c.15-.18.42-.3.69-.3a.71.71 0 01.51.21c.24.24.57.39.9.39h.03c.195 0 .33-.045.405-.09a9.29 9.29 0 01-.03-.51l-.003-.06c-.105-1.628-.231-3.654.3-4.847C5.859 1.069 9.216.793 10.206.793h2z"/></svg>
        Snapchat
      </a>
      <a href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
        style={{ background: "#1a1a1a", color: "white" }}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
        style={{ background: "#1877F2", color: "white" }}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        Facebook
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
        style={{ background: "#0A66C2", color: "white" }}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        LinkedIn
      </a>
      <a href={`https://reddit.com/submit?url=${encodedUrl}&title=${text}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
        style={{ background: "#FF4500", color: "white" }}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
        Reddit
      </a>
      <button onClick={copyLink}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
        style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
