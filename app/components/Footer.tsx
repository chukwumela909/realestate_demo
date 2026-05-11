import BackToTop from "./BackToTop";

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-12 gap-y-10 gap-x-6 mb-12 sm:mb-16">
          <div className="col-span-12 lg:col-span-5">
            <div className="font-serif text-[28px] sm:text-[32px] tracking-[0.18em] text-ink mb-3 sm:mb-4">
              cloud9
            </div>
            <p className="font-serif italic text-[16px] sm:text-[17px] leading-[1.6] text-ink-soft max-w-sm">
              A friendly index of mixed-use land across Nigeria. Central and
              northern first, with western and southern parcels in view.
            </p>
          </div>

          <FooterColumn
            title="Index"
            items={["Available land", "All parcels", "Archive", "Submit land"]}
          />
          <FooterColumn
            title="Office"
            items={["Specialists", "Journal", "Press", "Careers"]}
          />
          <FooterColumn
            title="Contact"
            items={[
              "sales@cloud9.ng",
              "+234 (0) 700 000 9000",
              "Abuja land desk",
              "Nigeria",
            ]}
          />
        </div>

        <div className="border-t border-hairline pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-muted">
          <div className="flex items-center gap-3 sm:gap-6">
            <span>© MMXXVI cloud9</span>
            <span className="text-hairline-strong">·</span>
            <span>All land listings verified</span>
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
    <div className="col-span-12 sm:col-span-6 lg:col-span-2">
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
