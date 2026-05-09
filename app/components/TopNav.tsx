export default function TopNav() {
  const items = ["Buy", "Sell", "Journal", "Index"];
  return (
    <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-sm border-b border-hairline">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 h-16 flex items-center justify-between">
        <a
          href="/"
          className="font-serif text-[22px] tracking-[0.18em] text-ink transition-colors duration-300 hover:text-accent"
        >
          MAISON
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {items.map((item) => (
            <a
              key={item}
              href="#"
              className="relative text-[13px] tracking-[0.06em] text-ink-soft hover:text-ink transition-colors duration-300 group py-1"
            >
              <span>{item}</span>
              <span
                aria-hidden
                className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <span className="hidden sm:inline text-[11px] tracking-[0.18em] text-ink-muted uppercase">
            EN
          </span>
          <a
            href="#"
            className="text-[13px] tracking-[0.06em] text-ink hover:text-accent transition-colors duration-300"
          >
            Sign in
          </a>
        </div>
      </div>
    </header>
  );
}
