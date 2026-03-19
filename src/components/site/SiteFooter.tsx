import Link from "next/link";

export function SiteFooter() {
  return (
    <footer
      className="w-full px-6 py-10 mt-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div
            className="text-[10px] tracking-[0.25em] uppercase mb-1"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            NUUN Creative Lab
          </div>
          <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            contact@nuun.dev · 801-550-0241
          </div>
        </div>

        <div className="flex gap-6">
          {[
            { href: "/manifesto", label: "Manifesto" },
            { href: "/concepts",  label: "Concepts"  },
            { href: "/contact",   label: "Contact"   },
            { href: "/privacy",   label: "Privacy"   },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[10px] tracking-[0.15em] uppercase transition-colors"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
