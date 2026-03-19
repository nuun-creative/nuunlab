"use client";

import Link from "next/link";
import type { ConceptData } from "@/data/concepts";

export function ConceptsGrid({ concepts }: { concepts: ConceptData[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
      {concepts.map((concept, i) => (
        <Link key={concept.slug} href={`/concepts/${concept.slug}`}>
          <article
            className="h-full p-6 rounded transition-all cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,222,128,0.3)";
              (e.currentTarget as HTMLElement).style.background = "rgba(74,222,128,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
            }}
          >
            <div className="text-2xl mb-4">{concept.icon}</div>
            <p
              className="text-[9px] tracking-[0.2em] uppercase mb-3"
              style={{ color: "rgba(74,222,128,0.5)", fontFamily: '"Courier New", monospace' }}
            >
              CONCEPT {String(i + 1).padStart(2, "0")}
            </p>
            <h2
              className="text-lg font-bold mb-2 leading-snug"
              style={{ color: "#ffffff" }}
            >
              {concept.title}
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {concept.tagline}
            </p>
          </article>
        </Link>
      ))}
    </div>
  );
}
