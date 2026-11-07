import React from "react";

export interface JsonLdGraphProps {
  items: Record<string, unknown>[];
}

export function JsonLd({ items }: JsonLdGraphProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": items,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

