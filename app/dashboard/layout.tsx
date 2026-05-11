import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas text-ink flex">
      {/* sidebar */}
      <aside className="hidden md:flex w-[220px] flex-shrink-0 border-r border-hairline flex-col">
        <div className="px-6 py-5 border-b border-hairline">
          <Link
            href="/dashboard"
            className="font-serif text-[20px] tracking-[0.18em] text-ink hover:text-accent transition-colors"
          >
            cloud9
          </Link>
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-ink-muted mt-1">
            Land desk
          </div>
        </div>

        <nav className="flex flex-col py-4">
          <NavItem href="/dashboard">Conversations</NavItem>
          <NavItem href="/dashboard/properties">Properties</NavItem>
        </nav>

        <div className="mt-auto px-6 py-4 border-t border-hairline">
          <Link
            href="/"
            className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-muted hover:text-ink transition-colors"
          >
            ← Front site
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-6 py-3 text-[13px] tracking-[0.04em] text-ink-soft hover:text-ink hover:bg-canvas-deep/40 transition-colors duration-200"
    >
      {children}
    </Link>
  );
}
