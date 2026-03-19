import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JoinCTA } from "@/components/site/JoinCTA";
import { ConceptsGrid } from "@/components/site/ConceptsGrid";
import { CONCEPTS } from "@/data/concepts";

export const metadata: Metadata = buildMetadata({
  title: "The Possibility Gallery",
  description:
    "Not just what could it say. What could it feel like to step into your brand? A gallery of immersive website directions.",
  path: "/concepts",
});

export default function ConceptsPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#0d0d0d", color: "rgba(255,255,255,0.85)" }}
    >
      <SiteNav />

      <main className="max-w-5xl mx-auto px-6 pt-36 pb-20">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p
            className="text-[10px] tracking-[0.25em] uppercase mb-6"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            NUUN Creative Lab · Concepts
          </p>
          <h1
            className="text-4xl font-black leading-tight mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            What could your website{" "}
            <em style={{ color: "#4ade80", fontStyle: "italic" }}>feel</em>{" "}
            like?
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Not just what could it say. What could it feel like to step into your brand?
            This is not a portfolio of templates. It&apos;s a gallery of possibilities.
          </p>
        </div>

        {/* Concept grid — client component (hover handlers) */}
        <ConceptsGrid concepts={CONCEPTS} />

        {/* CTA */}
        <div
          className="pt-12 flex flex-col gap-4 max-w-lg"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            See something that fits? Let&apos;s talk about building it for your brand.
          </p>
          <div>
            <JoinCTA label="Join the Revolution" />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
