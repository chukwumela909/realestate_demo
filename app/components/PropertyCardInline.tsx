"use client";

import { useEffect, useState } from "react";

export type PropertyImage = { url: string; alt: string | null; isPrimary: boolean };

export type PropertyDetail = {
  id: string;
  name: string;
  caption: string;
  price: string;
  location: string;
  status: string;
  available: boolean;
  moods: string[];
  images: PropertyImage[];
};

export default function PropertyCardInline({
  propertyId,
  onOpen,
}: {
  propertyId: string;
  onOpen: (data: PropertyDetail, originRect: DOMRect | null) => void;
}) {
  const [data, setData] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/properties/${propertyId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (cancelled) return;
        setData(j);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  if (loading) {
    return (
      <div className="my-3 border border-hairline bg-canvas h-[88px] animate-pulse" />
    );
  }

  if (!data) {
    return (
      <div className="my-3 px-3 py-2 border border-hairline bg-canvas text-[12px] font-mono text-ink-muted">
        Couldn&apos;t load this land listing.
      </div>
    );
  }

  const primary = data.images.find((i) => i.isPrimary) ?? data.images[0];
  const statusLabel =
    data.status === "available"
      ? null
      : data.status === "under_offer"
        ? "Under offer"
        : data.status === "reserved"
          ? "Reserved"
          : "Sold";

  return (
    <button
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onOpen(data, rect);
      }}
      className="group my-3 flex gap-3 items-stretch w-full text-left bg-canvas border border-hairline hover:border-ink transition-colors duration-300"
    >
      <div className="relative w-[96px] h-[96px] flex-shrink-0 overflow-hidden bg-canvas-deep">
        {primary?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primary.url}
            alt={primary.alt ?? data.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        )}
      </div>

      <div className="flex-1 min-w-0 py-2 pr-3 flex flex-col justify-between">
        <div>
          <div className="font-serif text-[15px] leading-tight text-ink truncate">
            {data.name}
          </div>
          <div className="font-serif italic text-[12px] leading-snug text-ink-soft mt-0.5 line-clamp-2">
            {data.caption}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono tracking-[0.08em] text-ink">
          <span>{data.price}</span>
          <span className="h-2.5 w-px bg-hairline-strong" />
          <span className="text-ink-soft truncate">{data.location}</span>
          {statusLabel && (
            <>
              <span className="h-2.5 w-px bg-hairline-strong" />
              <span className="text-accent uppercase">{statusLabel}</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
