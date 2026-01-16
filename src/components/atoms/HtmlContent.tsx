"use client";

import { cn } from "@/lib/utils";

interface HtmlContentProps {
  html: string;
  className?: string;
  as?: "p" | "div" | "span";
}

export function HtmlContent({ html, className, as: Tag = "div" }: HtmlContentProps) {
  return (
    <Tag
      className={cn(
        // Reset prose styling
        "[&_strong]:font-semibold [&_em]:italic [&_u]:underline",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2",
        "[&_li]:my-1",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

