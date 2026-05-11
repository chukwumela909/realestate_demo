"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteConversationButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("delete failed");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setBusy(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center justify-end gap-2 text-[10px] font-mono tracking-[0.18em] uppercase">
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="text-accent hover:underline disabled:opacity-50"
        >
          Confirm delete
        </button>
        <span className="text-ink-muted">/</span>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={busy}
          className="text-ink-muted hover:text-ink disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      disabled={busy}
      aria-label={`Delete conversation ${label}`}
      className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-muted hover:text-accent transition-colors disabled:opacity-50"
    >
      Delete
    </button>
  );
}
