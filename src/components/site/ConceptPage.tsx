import Link from "next/link";
import type { ConceptData } from "@/data/concepts";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { JoinCTA } from "./JoinCTA";

interface ConceptPageProps {
  concept: ConceptData;
  index: number;
}

export function ConceptPage({ concept, index }: ConceptPageProps) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#0d0d0d", color: "rgba(255,255,255,0.85)" }}
    >
      <SiteNav />

      <main className="max-w-2xl mx-auto px-6 pt-36 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-12">
          <Link
            href="/concepts"
            className="text-[9px] tracking-[0.2em] uppercase transition-colors"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            ← All Concepts
          </Link>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
          <span
            className="text-[9px] tracking-[0.2em] uppercase"
            style={{ color: "rgba(74,222,128,0.5)", fontFamily: '"Courier New", monospace' }}
          >
            CONCEPT {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Hero */}
        <div className="mb-16">
          <div className="text-4xl mb-6">{concept.icon}</div>
          <h1
            className="text-4xl font-black leading-tight mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            {concept.title}
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {concept.tagline}
          </p>
        </div>

        {/* What it feels like */}
        <section className="mb-12" aria-labelledby="feels-heading">
          <p
            className="text-[9px] tracking-[0.25em] uppercase mb-4"
            style={{ color: "rgba(74,222,128,0.45)" }}
          >
            WHAT IT FEELS LIKE
          </p>
          <p
            id="feels-heading"
            className="text-base leading-8"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {concept.feels}
          </p>
        </section>

        {/* For brands */}
        <section
          className="mb-16 p-6 rounded"
          aria-labelledby="for-heading"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            className="text-[9px] tracking-[0.25em] uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            THIS IS FOR YOU IF
          </p>
          <p
            id="for-heading"
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {concept.forBrands}
          </p>
        </section>

        {/* Status note */}
        <div
          className="mb-12 flex items-center gap-3"
          style={{
            padding: "10px 14px",
            background: "rgba(74,222,128,0.04)",
            border: "1px solid rgba(74,222,128,0.12)",
            borderRadius: 4,
          }}
        >
          <span
            className="text-[9px] tracking-[0.2em] uppercase"
            style={{ color: "rgba(74,222,128,0.6)", fontFamily: '"Courier New", monospace' }}
          >
            BEING BUILT IN THE LAB
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 9 }}>·</span>
          <span
            className="text-[9px]"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Live demo coming soon
          </span>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Interested in this direction for your brand?
          </p>
          <div>
            <JoinCTA label="Let's build this together" />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
