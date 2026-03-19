import Link from "next/link";

export function SiteNav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: "rgba(13,13,13,0.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
      aria-label="Site navigation"
    >
      <Link
        href="/"
        className="text-[10px] tracking-[0.25em] uppercase transition-colors"
        style={{ color: "rgba(255,255,255,0.5)" }}
        onMouseOver={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.9)")}
        onMouseOut={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
      >
        ← NUUN Creative Lab
      </Link>

      <div className="flex items-center gap-6">
        {[
          { href: "/manifesto", label: "Manifesto" },
          { href: "/concepts",  label: "Concepts"  },
          { href: "/contact",   label: "Contact"   },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-[10px] tracking-[0.2em] uppercase transition-colors hidden sm:block"
            style={{ color: "rgba(255,255,255,0.38)" }}
            onMouseOver={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.75)")}
            onMouseOut={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.38)")}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
