import { CLOUD9_CONTACT } from "../lib/cloud9Knowledge";
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
              Cloud9 Properties Limited makes real estate ownership simple,
              transparent, and rewarding from Gwagwalada, Abuja.
            </p>
          </div>

          <FooterColumn
            title="Project"
            items={["Pearl Residence", "400 SQM", "200 SQM", "165 SQM"]}
          />
          <FooterColumn
            title="Services"
            items={["Property sales", "Investment", "Management", "Consulting"]}
          />
          <FooterColumn
            title="Contact"
            items={[
              CLOUD9_CONTACT.email,
              CLOUD9_CONTACT.phone,
              "Gwagwalada office",
              "Abuja FCT",
            ]}
          />
        </div>

        <div className="border-t border-hairline pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono tracking-[0.18em] uppercase text-ink-muted">
          <div className="flex items-center gap-3 sm:gap-6">
            <span>Copyright 2026 Cloud9 Properties Limited</span>
            <span className="text-hairline-strong">/</span>
            <span>Verified property deals</span>
          </div>
          <BackToTop className="group flex items-center gap-2 text-ink hover:text-accent transition-colors duration-300">
            <span>Back to top</span>
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
              className="text-[14px] text-ink-soft hover:text-ink transition-colors break-words"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
