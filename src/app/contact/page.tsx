import type { Metadata } from "next";
import Script from "next/script";
import { buildMetadata } from "@/lib/metadata";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = buildMetadata({
  title: "Start a Project",
  description:
    "Ready to make something worth finding? Let's talk about your brand, your audience, and what we could build together.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#0d0d0d", color: "rgba(255,255,255,0.85)" }}
    >
      <SiteNav />

      <main className="max-w-2xl mx-auto px-6 pt-36 pb-20">
        {/* Header */}
        <div className="mb-16">
          <p
            className="text-[10px] tracking-[0.25em] uppercase mb-6"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            NUUN Creative Lab · Contact
          </p>
          <h1
            className="text-4xl font-black leading-tight mb-6"
            style={{ letterSpacing: "-0.03em" }}
          >
            Ready to make something
            <br />
            worth{" "}
            <em style={{ color: "#4ade80", fontStyle: "italic" }}>finding?</em>
          </h1>
          <p
            className="text-base leading-relaxed max-w-lg"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Tell us about your brand, your audience, and what you want people to
            feel when they land on your site. We'll figure out the rest together.
          </p>
        </div>

        {/* Primary CTA — GHL scheduling embed goes here */}
        <div
          className="mb-16 p-8 rounded"
          style={{ border: "1px solid rgba(74,222,128,0.15)", background: "rgba(74,222,128,0.03)" }}
        >
          <p
            className="text-xs tracking-[0.15em] uppercase mb-4"
            style={{ color: "rgba(74,222,128,0.5)", fontFamily: '"Courier New", monospace' }}
          >
            SCHEDULE A CONVERSATION
          </p>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
            Book a free 30-minute call to explore what we could build together.
          </p>

          <iframe
            src="https://api.leadconnectorhq.com/widget/booking/s8hoY8T1BRL7vcOrMB1i"
            style={{ width: "100%", border: "none", overflow: "hidden", minHeight: 900 }}
            id="s8hoY8T1BRL7vcOrMB1i_1773945206750"
            title="Schedule a conversation with NUUN Creative"
          />
          <Script
            src="https://link.msgsndr.com/js/form_embed.js"
            strategy="afterInteractive"
          />
        </div>

        {/* Direct contact */}
        <div
          className="space-y-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2rem" }}
        >
          <p
            className="text-[10px] tracking-[0.2em] uppercase mb-6"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            OR REACH OUT DIRECTLY
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:contact@nuun.dev"
              className="text-sm transition-colors"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              contact@nuun.dev
            </a>
            <a
              href="tel:8015500241"
              className="text-sm transition-colors"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              801-550-0241
            </a>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
