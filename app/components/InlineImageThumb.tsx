"use client";

// A small clickable thumbnail used when the bot leaks raw markdown images
// in its prose. Click expands to ImageLightbox via parent handler.

export default function InlineImageThumb({
  url,
  alt,
  onOpen,
}: {
  url: string;
  alt: string;
  onOpen: (url: string, alt: string, rect: DOMRect) => void;
}) {
  // Try to downsize Unsplash thumbnails by rewriting the w= param.
  const thumbUrl = url.replace(/([?&])w=\d+/, "$1w=240");

  return (
    <button
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onOpen(url, alt, rect);
      }}
      title={alt || "View image"}
      className="group inline-block align-middle mr-2 mb-2 overflow-hidden bg-canvas-deep border border-hairline hover:border-ink transition-colors duration-300"
    >
      <span className="block w-[88px] h-[64px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbUrl}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
      </span>
    </button>
  );
}
