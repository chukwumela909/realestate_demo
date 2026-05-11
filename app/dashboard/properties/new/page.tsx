import Link from "next/link";
import PropertyForm from "../PropertyForm";

export const dynamic = "force-dynamic";

export default function NewPropertyPage() {
  return (
    <div className="px-8 lg:px-12 py-10 lg:py-14">
      <Link
        href="/dashboard/properties"
        className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted hover:text-ink transition-colors"
      >
        ← Properties
      </Link>

      <header className="mt-6 mb-10">
        <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted mb-2">
          New land listing
        </div>
        <h1 className="font-serif text-[40px] lg:text-[48px] leading-[1.05] text-ink">
          Add to <span className="italic font-light">the index</span>
        </h1>
      </header>

      <PropertyForm
        mode="create"
        initial={{
          name: "",
          caption: "",
          price: "",
          location: "",
          status: "available",
          moods: [],
          images: [],
        }}
      />
    </div>
  );
}
