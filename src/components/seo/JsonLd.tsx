import React from "react";

export interface JsonLdGraphProps {
  items: Record<string, unknown>[];
}

function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ items }: JsonLdGraphProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": items,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(structuredData) }}
    />
  );
}
