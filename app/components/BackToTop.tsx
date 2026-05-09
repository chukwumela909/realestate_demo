"use client";

export default function BackToTop({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      window.scrollTo(0, 0);
      return;
    }

    const start = window.scrollY;
    const startTime = performance.now();
    const duration = 900;
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutQuart(t);
      window.scrollTo(0, start * (1 - eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  return (
    <a href="#top" onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
