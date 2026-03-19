"use client";

import Link from "next/link";
import { LabEvents } from "@/lib/analytics";

interface JoinCTAProps {
  label?: string;
  /** Override href — will be replaced with GHL booking URL when ready.
   *  Set NEXT_PUBLIC_GHL_BOOKING_URL env var to wire automatically. */
  href?: string;
  variant?: "primary" | "outline";
  className?: string;
}

/**
 * Reusable "Join the Revolution" CTA.
 *
 * To wire the GHL scheduling form:
 *   1. Set NEXT_PUBLIC_GHL_BOOKING_URL in your env
 *   2. Or pass href prop directly
 */
export function JoinCTA({
  label = "Join the Revolution",
  href,
  variant = "primary",
  className = "",
}: JoinCTAProps) {
  // Use || not ?? so an empty-string env var still falls back to /contact
  const destination =
    href ||
    process.env.NEXT_PUBLIC_GHL_BOOKING_URL ||
    "/contact";

  const isExternal = destination.startsWith("http");

  const handleClick = () => LabEvents.ctaClick(label, destination);

  const baseStyle: React.CSSProperties =
    variant === "primary"
      ? {
          background: "rgba(74,222,128,0.1)",
          border: "1px solid rgba(74,222,128,0.35)",
          color: "#4ade80",
        }
      : {
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.7)",
        };

  const button = (
    <button
      onClick={handleClick}
      className={`inline-block text-xs tracking-[0.2em] uppercase px-6 py-3 transition-all hover:brightness-125 cursor-pointer ${className}`}
      style={baseStyle}
    >
      {label}
    </button>
  );

  if (isExternal) {
    return (
      <a href={destination} target="_blank" rel="noopener noreferrer">
        {button}
      </a>
    );
  }

  return <Link href={destination}>{button}</Link>;
}
