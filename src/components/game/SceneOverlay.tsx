"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { LabEvents } from "@/lib/analytics";

interface SceneOverlayProps {
  isMobile: boolean;
}

export function SceneOverlay({ isMobile }: SceneOverlayProps) {
  const reduced = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <>
      {/* Bottom-left: tagline + hero CTA */}
      <div className="absolute bottom-10 left-6 z-20 select-none">
        <motion.p
          className="text-[11px] font-medium tracking-[0.25em] uppercase mb-2 pointer-events-none"
          style={{ color: "rgba(255,255,255,0.4)" }}
          {...fadeUp(0.4)}
        >
          NUUN Creative Lab
        </motion.p>
        <motion.h1
          className="text-3xl font-bold text-white leading-tight pointer-events-none"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
          {...fadeUp(0.55)}
        >
          We make things
          <br />
          worth{" "}
          <em style={{ color: "#4ade80", fontStyle: "italic" }}>finding.</em>
        </motion.h1>
        <motion.div {...fadeUp(0.75)} className="mt-4">
          <Link
            href="/contact"
            onClick={() => LabEvents.ctaClick("Start a Project", "/contact")}
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{
              color: "#4ade80",
              borderBottom: "1px solid rgba(74,222,128,0.4)",
              paddingBottom: 2,
            }}
          >
            Start a Project →
          </Link>
        </motion.div>
      </div>

      {/* Bottom-center: interaction hint */}
      <motion.div
        className="absolute bottom-9 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: reduced ? 0.55 : [0, 0.65, 0.45, 0.65, 0] }}
        transition={
          reduced
            ? { delay: 1.5, duration: 0.4 }
            : { delay: 1.8, duration: 3, repeat: Infinity, repeatDelay: 4 }
        }
      >
        {isMobile ? (
          <>
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={1.4}
            >
              <path d="M4 10h12M4 10l3-3M4 10l3 3M16 10l-3-3M16 10l-3 3" />
            </svg>
            <span
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Drag to explore
            </span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1.4}
            >
              <circle cx="8" cy="5.5" r="2.5" />
              <path d="M8 8v5M6.5 11.5l1.5 1.5 1.5-1.5" />
            </svg>
            <span
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Click objects to explore
            </span>
          </>
        )}
      </motion.div>
    </>
  );
}
