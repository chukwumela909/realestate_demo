import BackToTop from "./BackToTop";

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 lg:col-span-5">
            <div className="font-serif text-[32px] tracking-[0.18em] text-ink mb-4">
              MAISON
            </div>
            <p className="font-serif italic text-[17px] leading-[1.6] text-ink-soft max-w-sm">
              An index of architecturally significant residences. Published
              monthly. Read at your own pace.
            </p>
          </div>

          <FooterColumn
            title="Index"
            items={["This issue", "All residences", "Archive", "Submit a home"]}
          />
          <FooterColumn
            title="Office"
            items={["Specialists", "Journal", "Press", "Careers"]}
          />
          <FooterColumn
            title="Contact"
            items={[
              "concierge@maison.co",
              "+1 (212) 555-0142",
              "47 Greene Street",
              "New York, NY 10013",
            ]}
          />
        </div>

        <div className="border-t border-hairline pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-muted">
          <div className="flex items-center gap-3 sm:gap-6">
            <span>© MMXXVI MAISON</span>
            <span className="text-hairline-strong">·</span>
            <span>All listings independent</span>
          </div>
          <BackToTop className="group flex items-center gap-2 text-ink hover:text-accent transition-colors duration-300">
            <span>Back to top</span>
            <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1">
              ↑
            </span>
          </BackToTop>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="col-span-6 lg:col-span-2">
      <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted mb-4">
        {title}
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="text-[14px] text-ink-soft hover:text-ink transition-colors"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
