import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JoinCTA } from "@/components/site/JoinCTA";

export const metadata: Metadata = buildMetadata({
  title: "The Manifesto",
  description:
    "Most websites work. Very few are remembered. The internet used to feel like discovery — we think it still can.",
  path: "/manifesto",
});

const SECTIONS = [
  {
    label: "01 — THE PROBLEM",
    heading: "The internet used to feel like discovery.",
    body: "Not every page was polished. Not every experience was efficient. But it felt alive. You opened a browser and didn't know what you might find. Websites were strange, creative, personal — sometimes a little chaotic. People built things because they were curious. Because they wanted to show something to the world.",
  },
  {
    label: "02 — THE PATTERN",
    heading: "Somewhere along the way, we optimized the wonder out of it.",
    body: "A hero image. Three value propositions. A grid of logos. A call-to-action. Templates got cleaner. Brands got safer. Everything got easier to launch — and harder to care about. Today most websites are indistinguishable from each other. Efficient. Polished. Forgettable.",
  },
  {
    label: "03 — THE BELIEF",
    heading: "We think businesses deserve better than an online brochure.",
    body: "Not every website needs to break convention — but it should feel like someone made it. Someone who cared. Someone who understood what makes a brand worth paying attention to.\n\nWe build digital experiences that feel alive. Each one starts with a relationship — understanding what makes a business specific, human, worth remembering.",
  },
  {
    label: "04 — THE WORK",
    heading: "The internet should be interesting again.",
    body: "NUUN Creative is here to help build it. We make things that reward curiosity. That feel like they were made by a person, for people. That remember what the web is actually for.",
  },
] as const;

export default function ManifestoPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#0d0d0d", color: "rgba(255,255,255,0.85)" }}
    >
      <SiteNav />

      <main className="max-w-2xl mx-auto px-6 pt-36 pb-20">
        {/* Lede */}
        <div className="mb-20">
          <p
            className="text-[10px] tracking-[0.25em] uppercase mb-8"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            NUUN Creative Lab · The Manifesto
          </p>
          <h1
            className="font-black leading-none mb-4"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "-0.04em" }}
          >
            Most websites work.
          </h1>
          <h2
            className="font-black italic leading-none"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "-0.04em",
              color: "#4ade80",
            }}
          >
            Very few are remembered.
          </h2>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {SECTIONS.map((section, i) => (
            <section key={i} aria-labelledby={`section-${i}`}>
              <p
                className="text-[9px] tracking-[0.25em] uppercase mb-3"
                style={{ color: "rgba(74,222,128,0.5)" }}
              >
                {section.label}
              </p>
              <h3
                id={`section-${i}`}
                className="text-xl font-bold mb-4 leading-snug"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                {section.heading}
              </h3>
              <p
                className="text-base leading-8 whitespace-pre-line"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-20 pt-12 flex flex-col gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="text-sm"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            If this resonates, we should talk.
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
