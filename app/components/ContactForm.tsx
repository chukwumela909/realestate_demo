"use client";

import { useEffect, useRef, useState } from "react";

type Field = "email" | "phone" | "name";

const COPY: Record<
  Field,
  { label: string; placeholder: string; type: string; autocomplete: string }
> = {
  email: {
    label: "Email",
    placeholder: "you@example.com",
    type: "email",
    autocomplete: "email",
  },
  phone: {
    label: "Phone",
    placeholder: "0916 787 9100",
    type: "tel",
    autocomplete: "tel",
  },
  name: {
    label: "Name",
    placeholder: "Your name",
    type: "text",
    autocomplete: "name",
  },
};

export default function ContactForm({
  field,
  disabled,
  onSubmit,
}: {
  field: Field;
  disabled: boolean;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const copy = COPY[field];

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  function handle(e: React.FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (!v || submitted) return;
    setSubmitted(true);
    onSubmit(v);
  }

  if (submitted) {
    return (
      <div className="my-2 flex items-center gap-2 text-[12px] font-mono tracking-[0.06em] text-ink-muted animate-fade-in">
        <span className="text-accent">✓</span>
        <span>{copy.label} shared</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handle}
      className="my-3 flex items-stretch gap-0 border border-hairline bg-canvas focus-within:border-ink transition-colors duration-300 animate-fade-up"
    >
      <div className="flex-shrink-0 px-3 py-2 border-r border-hairline flex items-center text-[10px] font-mono tracking-[0.2em] uppercase text-ink-muted">
        {copy.label}
      </div>
      <input
        ref={inputRef}
        type={copy.type}
        autoComplete={copy.autocomplete}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder={copy.placeholder}
        className="flex-1 min-w-0 bg-transparent px-3 py-2 text-[14px] text-ink placeholder:text-ink-muted placeholder:italic placeholder:font-serif focus:outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="flex-shrink-0 px-3 text-[11px] font-mono tracking-[0.18em] uppercase text-ink hover:text-accent disabled:text-ink-muted transition-colors duration-300"
      >
        Send →
      </button>
    </form>
  );
}
