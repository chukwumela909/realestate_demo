"use client";

import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>(opts?: {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}) {
  const ref = useRef<T | null>(null);
  const { threshold = 0.15, rootMargin = "0px 0px -10% 0px", delay = 0 } =
    opts ?? {};

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => node.classList.add("is-visible"), delay);
            } else {
              node.classList.add("is-visible");
            }
            observer.unobserve(node);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, delay]);

  return ref;
}
