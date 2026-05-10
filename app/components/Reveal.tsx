"use client";

import { ReactNode } from "react";
import { useReveal } from "../lib/useReveal";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "header" | "article" | "p" | "h2" | "h3" | "span";
};

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: Props) {
  const ref = useReveal<HTMLDivElement>({ delay });
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
