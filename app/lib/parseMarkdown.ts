// Parse out markdown image syntax ![alt](url) from text and split into segments.
// Also strips bare URLs to avoid pasted Unsplash links cluttering the prose.

export type Segment =
  | { kind: "text"; text: string }
  | { kind: "image"; url: string; alt: string };

const IMG_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

export function parseMarkdownSegments(input: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  IMG_RE.lastIndex = 0;
  while ((m = IMG_RE.exec(input))) {
    if (m.index > last) {
      const text = input.slice(last, m.index);
      if (text) out.push({ kind: "text", text });
    }
    out.push({ kind: "image", alt: m[1] || "", url: m[2] });
    last = m.index + m[0].length;
  }
  if (last < input.length) {
    const tail = input.slice(last);
    if (tail) out.push({ kind: "text", text: tail });
  }

  // Clean text segments: strip bare image URLs left in prose, strip "Additional views:" leftovers
  return out.map((s) => {
    if (s.kind !== "text") return s;
    let t = s.text;
    // Remove standalone Unsplash URLs (and the surrounding whitespace/punctuation)
    t = t.replace(/https?:\/\/images\.unsplash\.com\/\S+/g, "");
    // Tidy leftover "Additional views:" lines that have no images now
    t = t.replace(/^\s*Additional views:\s*$/gm, "");
    // Collapse 3+ newlines to 2
    t = t.replace(/\n{3,}/g, "\n\n");
    return { kind: "text", text: t };
  });
}
