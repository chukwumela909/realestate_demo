"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ALLOWED_MOODS,
  ALLOWED_STATUS,
  slugify,
  type PropertyImageInput,
} from "../../lib/propertyValidation";

export type FormInitial = {
  id?: string;
  name: string;
  caption: string;
  price: string;
  location: string;
  status: string;
  moods: string[];
  images: PropertyImageInput[];
};

const EMPTY_IMAGE: PropertyImageInput = {
  url: "",
  alt: "",
  isPrimary: false,
};

export default function PropertyForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial: FormInitial;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [caption, setCaption] = useState(initial.caption);
  const [price, setPrice] = useState(initial.price);
  const [location, setLocation] = useState(initial.location);
  const [status, setStatus] = useState(initial.status || "available");
  const [moods, setMoods] = useState<string[]>(initial.moods);
  const [id, setId] = useState(initial.id ?? "");
  const [idTouched, setIdTouched] = useState(mode === "edit");
  const [images, setImages] = useState<PropertyImageInput[]>(
    initial.images.length > 0 ? initial.images : [{ ...EMPTY_IMAGE, isPrimary: true }],
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  function updateName(value: string) {
    setName(value);
    if (mode === "create" && !idTouched) setId(slugify(value));
  }

  function toggleMood(m: string) {
    setMoods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  }

  function updateImage(idx: number, patch: Partial<PropertyImageInput>) {
    setImages((prev) =>
      prev.map((img, i) => (i === idx ? { ...img, ...patch } : img)),
    );
  }

  function setPrimary(idx: number) {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === idx })),
    );
  }

  function removeImage(idx: number) {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (next.length > 0 && !next.some((x) => x.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next.length > 0 ? next : [{ ...EMPTY_IMAGE, isPrimary: true }];
    });
  }

  function addImage() {
    setImages((prev) => [...prev, { ...EMPTY_IMAGE }]);
  }

  function moveImage(idx: number, dir: -1 | 1) {
    setImages((prev) => {
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setBusy(true);

    const payload = {
      id: mode === "create" ? id : undefined,
      name,
      caption,
      price,
      location,
      status,
      moods,
      images,
    };

    try {
      const url =
        mode === "create"
          ? "/api/properties"
          : `/api/properties/${initial.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let body: { errors?: string[] } = {};
        try {
          body = await res.json();
        } catch {
          // ignore
        }
        setErrors(body.errors ?? [`Save failed (${res.status})`]);
        setBusy(false);
        return;
      }

      router.push("/dashboard/properties");
      router.refresh();
    } catch {
      setErrors(["Network error. Try again."]);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-10 max-w-3xl">
      {errors.length > 0 && (
        <div className="border border-accent/60 bg-accent/5 text-accent text-[13px] font-mono px-4 py-3 flex flex-col gap-1">
          {errors.map((e) => (
            <span key={e}>· {e}</span>
          ))}
        </div>
      )}

      <Section title="Identity">
        <Field label="Name">
          <input
            type="text"
            value={name}
            onChange={(e) => updateName(e.target.value)}
            placeholder="e.g. 400 SQM Plot"
            className={inputClass}
            required
          />
        </Field>
        <Field label="Id" hint="Used in URLs and the bot. Lowercase, hyphens.">
          <input
            type="text"
            value={id}
            onChange={(e) => {
              setId(slugify(e.target.value));
              setIdTouched(true);
            }}
            disabled={mode === "edit"}
            placeholder="jabi-growth-corridor"
            className={`${inputClass} ${mode === "edit" ? "opacity-60 cursor-not-allowed" : ""}`}
            required
          />
        </Field>
        <Field label="Caption" hint="One italic-serif sentence shown beside the plot option.">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Verified Pearl Residence plot for home buyers and investors..."
            className={`${inputClass} min-h-[88px] resize-y`}
            required
          />
        </Field>
      </Section>

      <Section title="Listing">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price">
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="NGN 420,000,000"
              className={inputClass}
              required
            />
          </Field>
          <Field label="Location">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Cloud9 Pearl Residence Phase 2, Gwagwalada, Abuja"
              className={inputClass}
              required
            />
          </Field>
        </div>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClass}
          >
            {ALLOWED_STATUS.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Tags" hint="Pick the region and development tags. The bot uses these to filter.">
        <div className="flex flex-wrap gap-2">
          {ALLOWED_MOODS.map((m) => {
            const active = moods.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggleMood(m)}
                className={`px-4 py-2 text-[13px] font-serif italic transition-colors duration-300 border ${
                  active
                    ? "bg-ink text-canvas border-ink"
                    : "bg-canvas text-ink-soft border-hairline hover:border-ink hover:text-ink"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </Section>

      <Section
        title="Images"
        hint="At least one. Pick which is primary - that's the photo used in cards and lists."
      >
        <div className="flex flex-col gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="border border-hairline bg-canvas-deep/30 p-3 flex flex-col sm:flex-row gap-3 items-start"
            >
              <div className="w-20 h-20 flex-shrink-0 bg-canvas-deep overflow-hidden">
                {img.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.url}
                    alt={img.alt || "preview"}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <input
                  type="url"
                  placeholder="https://commons.wikimedia.org/..."
                  value={img.url}
                  onChange={(e) => updateImage(idx, { url: e.target.value })}
                  className={inputClass}
                  required
                />
                <input
                  type="text"
                  placeholder="Alt text — what the image shows"
                  value={img.alt ?? ""}
                  onChange={(e) => updateImage(idx, { alt: e.target.value })}
                  className={inputClass}
                />
                <div className="flex items-center justify-between gap-3 text-[11px] font-mono tracking-[0.06em] uppercase">
                  <label className="flex items-center gap-2 text-ink-soft cursor-pointer">
                    <input
                      type="radio"
                      name="primaryImage"
                      checked={!!img.isPrimary}
                      onChange={() => setPrimary(idx)}
                      className="accent-ink"
                    />
                    Primary
                  </label>
                  <div className="flex items-center gap-3 text-ink-muted">
                    <button
                      type="button"
                      onClick={() => moveImage(idx, -1)}
                      disabled={idx === 0}
                      className="hover:text-ink disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(idx, 1)}
                      disabled={idx === images.length - 1}
                      className="hover:text-ink disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="hover:text-accent"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addImage}
            className="self-start text-[11px] font-mono tracking-[0.18em] uppercase text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors duration-300"
          >
            + Add image
          </button>
        </div>
      </Section>

      <div className="border-t border-hairline pt-6 flex items-center justify-between">
        <Link
          href="/dashboard/properties"
          className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-muted hover:text-ink transition-colors"
        >
          ← Cancel
        </Link>
        <button
          type="submit"
          disabled={busy}
          className="bg-ink text-canvas px-6 py-3 text-[12px] font-mono tracking-[0.18em] uppercase hover:bg-accent transition-colors duration-300 disabled:opacity-50"
        >
          {busy ? "Saving..." : mode === "create" ? "Create plot option" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full bg-canvas border border-hairline px-3 py-2.5 text-[14px] text-ink placeholder:text-ink-muted placeholder:italic placeholder:font-serif focus:outline-none focus:border-ink transition-colors duration-200";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1 border-b border-hairline pb-3">
        <h2 className="text-[11px] font-mono tracking-[0.2em] uppercase text-ink-muted">
          {title}
        </h2>
        {hint && (
          <p className="font-serif italic text-[13px] text-ink-soft">{hint}</p>
        )}
      </header>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink">
        {label}
      </span>
      {hint && (
        <span className="text-[12px] font-serif italic text-ink-soft">
          {hint}
        </span>
      )}
      {children}
    </label>
  );
}
