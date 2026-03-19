"use client";

import { motion } from "framer-motion";
import type { SceneCoords } from "@/hooks/useSceneCoords";
import type { Hotspot as HotspotType } from "@/types/scene";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HotspotProps {
  hotspot: HotspotType;
  toScreen: SceneCoords["toScreen"];
  toScreenRect: SceneCoords["toScreenRect"];
  isMobile: boolean;
  isFocused: boolean;
  onClick: (hotspot: HotspotType) => void;
  onHover?: (id: string | null) => void;
}

/** Pulsing ring shown on mobile when the object is in the viewport's focus zone. */
function MobilePulse({ cx, cy, reduced }: { cx: number; cy: number; reduced: boolean }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: cx - 12, top: cy - 12, width: 24, height: 24 }}
    >
      {!reduced && (
        <motion.span
          className="absolute inset-0 rounded-full border border-white/70"
          animate={{ scale: [1, 2], opacity: [0.7, 0] }}
          transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity, repeatDelay: 0.5 }}
        />
      )}
      <span className="absolute inset-[6px] rounded-full bg-white/80 shadow-[0_0_6px_2px_rgba(255,255,255,0.4)]" />
    </div>
  );
}

/**
 * A scene-native hotspot — no visible marker by default.
 * On desktop: the object region highlights on hover.
 * On mobile: a pulse ring appears at the object center when it's the focused zone.
 */
export function Hotspot({
  hotspot,
  toScreen,
  toScreenRect,
  isMobile,
  isFocused,
  onClick,
  onHover,
}: HotspotProps) {
  const reduced = useReducedMotion();
  const r = hotspot.region;
  const rect = toScreenRect(r.x1, r.y1, r.x2, r.y2);
  const center = toScreen(hotspot.x, hotspot.y);

  // Relative center position within the region div
  const relCx = center.x - rect.left;
  const relCy = center.y - rect.top;

  if (rect.width === 0) return null;

  return (
    <motion.button
      onClick={() => onClick(hotspot)}
      aria-label={`Explore: ${hotspot.label}`}
      className="absolute group focus-visible:outline-none"
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        cursor: "crosshair",
      }}
      onMouseEnter={() => !isMobile && onHover?.(hotspot.id)}
      onMouseLeave={() => !isMobile && onHover?.(null)}
      initial="idle"
      whileHover={isMobile ? "idle" : "hover"}
      whileFocus="hover"
    >
      {/* Hover highlight — region-sized glow overlay */}
      <motion.div
        className="absolute inset-0"
        variants={{
          idle: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.2 }}
        style={{
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)",
        }}
      />

      {/* Tooltip — desktop hover only */}
      {!isMobile && (
        <motion.span
          variants={{
            idle: { opacity: 0, y: 4 },
            hover: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.15 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/85 px-2.5 py-1 text-xs font-medium text-white pointer-events-none"
        >
          {hotspot.label}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/85" />
        </motion.span>
      )}

      {/* Mobile focused pulse */}
      {isMobile && isFocused && (
        <MobilePulse cx={relCx} cy={relCy} reduced={reduced} />
      )}

      {/* Mobile: label below pulse */}
      {isMobile && isFocused && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute pointer-events-none whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white"
          style={{
            left: relCx,
            top: relCy + 18,
            transform: "translateX(-50%)",
          }}
        >
          {hotspot.label}
        </motion.span>
      )}
    </motion.button>
  );
}
