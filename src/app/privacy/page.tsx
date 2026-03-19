import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How NUUN Creative collects, uses, and protects your information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#0d0d0d", color: "rgba(255,255,255,0.85)" }}
    >
      <SiteNav />

      <main className="max-w-2xl mx-auto px-6 pt-36 pb-20">
        <p
          className="text-[10px] tracking-[0.25em] uppercase mb-6"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          NUUN Creative Lab · Legal
        </p>
        <h1
          className="text-3xl font-black mb-12"
          style={{ letterSpacing: "-0.02em" }}
        >
          Privacy Policy
        </h1>

        <div className="space-y-10 text-sm leading-8" style={{ color: "rgba(255,255,255,0.5)" }}>
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>
              What we collect
            </h2>
            <p>
              When you use this site, we may collect usage data through analytics tools (such as
              Google Analytics) to understand how people interact with our content. This includes
              pages visited, time on site, and general geographic region. We do not collect
              personally identifiable information unless you contact us directly.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>
              How we use it
            </h2>
            <p>
              Usage data helps us improve the experience — understanding which parts of the lab
              people explore, where they get stuck, and what resonates. We don&apos;t sell this
              data, share it with third parties for advertising, or use it for anything other than
              making the site better.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>
              Cookies
            </h2>
            <p>
              Analytics tools may set cookies in your browser to track sessions and behavior across
              visits. You can disable cookies in your browser settings at any time. The interactive
              experience will still function without them.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>
              Contact
            </h2>
            <p>
              Questions about this policy? Reach us at{" "}
              <a
                href="mailto:contact@nuun.dev"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                contact@nuun.dev
              </a>
              .
            </p>
          </section>

          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Last updated: March 2026
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
