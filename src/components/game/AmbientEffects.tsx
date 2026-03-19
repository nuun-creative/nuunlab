"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { SceneCoords, ScreenRect } from "@/hooks/useSceneCoords";
import type { sceneRegions } from "@/data/sceneRegions";
import { sceneEffects } from "@/data/sceneEffects";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Regions = typeof sceneRegions;

interface AmbientEffectsProps {
  toScreenRect: SceneCoords["toScreenRect"];
  regions: Regions;
  /** Hotspot id currently under the cursor, e.g. "museum-door", "crt-monitor" */
  hoveredId?: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// CRT screen effect
// Position + rotation driven by sceneEffects.crtScreen.
// ─────────────────────────────────────────────────────────────────────────────
function CRTEffect({
  rect,
  rotation,
  reduced,
  hovered,
}: {
  rect: ScreenRect;
  rotation: number;
  reduced: boolean;
  hovered: boolean;
}) {
  if (rect.width === 0) return null;

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
        transformOrigin: "center",
      }}
    >
      {/* Phosphor glow */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0, 255, 80, 0.14)", mixBlendMode: "screen" }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0px, transparent 2px, rgba(0,0,0,0.24) 2px, rgba(0,0,0,0.24) 3px)",
        }}
      />

      {/* Center-bright vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 48%, transparent 35%, rgba(0,0,0,0.28) 100%)",
        }}
      />

      {/* Brightness pulse */}
      {!reduced && (
        <motion.div
          className="absolute inset-0"
          style={{ background: "rgba(0, 255, 80, 0.08)", mixBlendMode: "screen" }}
          animate={{ opacity: [1, 2.6, 1, 3.0, 1, 1.8, 1] }}
          transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }}
        />
      )}

      {/* Micro-flicker */}
      {!reduced && (
        <motion.div
          className="absolute inset-0 bg-black"
          animate={{ opacity: [0, 0, 0, 0, 0, 0, 0, 0, 0.55, 0, 0] }}
          transition={{ duration: 0.06, repeat: Infinity, repeatDelay: 6.4 }}
        />
      )}

      {/* Hover static twitch — one-shot sweep on hover enter */}
      <AnimatePresence>
        {hovered && !reduced && (
          <motion.div
            key="twitch"
            className="absolute left-0 right-0"
            style={{
              top: "18%",
              height: 2,
              background: "rgba(200,255,200,0.55)",
              mixBlendMode: "screen",
            }}
            initial={{ opacity: 0.9, y: 0 }}
            animate={{ opacity: 0, y: rect.height * 0.55 }}
            exit={{}}
            transition={{ duration: 0.45, ease: "easeIn" }}
          />
        )}
      </AnimatePresence>

      {/* Second static bar */}
      <AnimatePresence>
        {hovered && !reduced && (
          <motion.div
            key="twitch2"
            className="absolute left-0 right-0"
            style={{
              top: "30%",
              height: 1,
              background: "rgba(200,255,200,0.3)",
              mixBlendMode: "screen",
            }}
            initial={{ opacity: 0.7, y: 0 }}
            animate={{ opacity: 0, y: rect.height * 0.45 }}
            exit={{}}
            transition={{ duration: 0.38, ease: "easeIn", delay: 0.06 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bulb glow
// ─────────────────────────────────────────────────────────────────────────────
function BulbGlow({
  rect,
  color = "rgba(255, 190, 60, 0.22)",
  glowRadius = 3,
  delay = 0,
  reduced,
}: {
  rect: ScreenRect;
  color?: string;
  glowRadius?: number;
  delay?: number;
  reduced: boolean;
}) {
  if (rect.width === 0) return null;

  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;
  const r  = Math.max(rect.width, rect.height) * glowRadius;

  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        left: cx - r,
        top:  cy - r,
        width:  r * 2,
        height: r * 2,
        background: `radial-gradient(ellipse at center, ${color} 0%, transparent 60%)`,
      }}
      animate={
        reduced
          ? { opacity: 0.75 }
          : {
              opacity: [0.6, 1.0, 0.65, 1.0, 0.75, 0.95, 0.6],
              scale:   [1, 1.07, 1, 1.09, 1, 1.04, 1],
            }
      }
      transition={{ duration: 0.28, ease: "easeInOut", repeat: Infinity, repeatDelay: delay + 2.6 }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Lava lamp — multi-blob animated shapes (position from sceneRegions)
// ─────────────────────────────────────────────────────────────────────────────
function LavaLampGlow({ rect, reduced }: { rect: ScreenRect; reduced: boolean }) {
  if (rect.width === 0) return null;

  const bw = rect.width * 0.78;

  return (
    <>
      {/* Outer ambient spill */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left:   rect.left - rect.width * 0.35,
          top:    rect.top,
          width:  rect.width * 1.7,
          height: rect.height,
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(30, 210, 160, 0.14) 0%, transparent 65%)",
        }}
        animate={
          reduced
            ? { opacity: 0.7 }
            : { opacity: [0.55, 0.95, 0.6, 0.9, 0.55], scale: [1, 1.03, 0.98, 1.04, 1] }
        }
        transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Blob container — clipped to lamp region */}
      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
      >
        <motion.div
          style={{
            position: "absolute",
            width: bw, height: bw,
            borderRadius: "44% 56% 52% 48% / 48% 44% 56% 52%",
            left: rect.width * 0.11,
            background: "radial-gradient(ellipse at center, rgba(30, 215, 165, 0.62) 0%, transparent 68%)",
          }}
          animate={
            reduced ? {} : {
              y: [rect.height*0.46, rect.height*0.10, rect.height*0.50, rect.height*0.20, rect.height*0.46],
              scale: [1, 1.14, 0.92, 1.10, 1],
              borderRadius: [
                "44% 56% 52% 48% / 48% 44% 56% 52%",
                "52% 48% 44% 56% / 56% 52% 44% 48%",
                "48% 52% 56% 44% / 44% 56% 52% 48%",
                "56% 44% 48% 52% / 52% 48% 44% 56%",
                "44% 56% 52% 48% / 48% 44% 56% 52%",
              ],
            }
          }
          transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          style={{
            position: "absolute",
            width: bw * 0.60, height: bw * 0.60,
            borderRadius: "52% 48% 44% 56% / 44% 56% 48% 52%",
            left: rect.width * 0.2,
            background: "radial-gradient(ellipse at center, rgba(20, 195, 148, 0.50) 0%, transparent 70%)",
          }}
          animate={
            reduced ? {} : {
              y: [rect.height*0.16, rect.height*0.60, rect.height*0.26, rect.height*0.66, rect.height*0.16],
              scale: [1, 0.86, 1.18, 0.92, 1],
            }
          }
          transition={{ duration: 8.2, ease: "easeInOut", repeat: Infinity, delay: 2.1 }}
        />
        <motion.div
          style={{
            position: "absolute",
            width: bw * 0.42, height: bw * 0.42,
            borderRadius: "50%",
            left: rect.width * 0.26,
            background: "radial-gradient(ellipse at center, rgba(40, 225, 158, 0.40) 0%, transparent 70%)",
          }}
          animate={
            reduced ? {} : {
              y: [rect.height*0.70, rect.height*0.34, rect.height*0.76, rect.height*0.40, rect.height*0.70],
            }
          }
          transition={{ duration: 9.8, ease: "easeInOut", repeat: Infinity, delay: 4.4 }}
        />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Museum door light crack — position from sceneEffects.museumDoorCrack
// ─────────────────────────────────────────────────────────────────────────────
function MuseumDoorCrack({
  rect,
  hovered,
  reduced,
}: {
  rect: ScreenRect;
  hovered: boolean;
  reduced: boolean;
}) {
  if (rect.width === 0 || reduced) return null;

  const blurPx = Math.max(3, rect.width * 0.25);

  return (
    <AnimatePresence>
      {hovered && (
        <>
          {/* Vertical light crack */}
          <motion.div
            key="crack"
            className="absolute pointer-events-none"
            style={{
              left:   rect.left - rect.width * 0.5,
              top:    rect.top,
              width:  rect.width * 2,
              height: rect.height,
              background:
                "linear-gradient(to right, transparent 0%, rgba(255,200,110,0.45) 35%, rgba(255,230,170,0.65) 55%, transparent 100%)",
              filter: `blur(${blurPx}px)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.55, 0.88, 0.60, 0.92, 0.60] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
          />

          {/* Warm ambient spill into the room */}
          <motion.div
            key="spill"
            className="absolute pointer-events-none"
            style={{
              left:   rect.left - rect.width * 4,
              top:    rect.top  + rect.height * 0.1,
              width:  rect.width * 10,
              height: rect.height * 0.8,
              background:
                "radial-gradient(ellipse at right center, rgba(255,190,80,0.18) 0%, transparent 65%)",
              filter: "blur(10px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38 }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cassette player LED — position from sceneEffects.cassetteLED
// Red dot that pulses faster on hover.
// ─────────────────────────────────────────────────────────────────────────────
function CassetteIndicator({
  cx,
  cy,
  r,
  hovered,
  reduced,
}: {
  cx: number;
  cy: number;
  r: number;
  hovered: boolean;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left:         cx - r,
        top:          cy - r,
        width:        r * 2,
        height:       r * 2,
        borderRadius: "50%",
        background:   "#ff3030",
        boxShadow:    `0 0 ${r * 5}px ${r * 2}px rgba(255,30,30,0.45)`,
      }}
      animate={
        reduced
          ? {}
          : {
              opacity: hovered ? [0.75, 1, 0.75] : [0.25, 0.55, 0.25],
              scale:   hovered ? [1, 1.4, 1]     : [1, 1.1, 1],
            }
      }
      transition={{
        duration: hovered ? 0.7 : 2.8,
        ease:     "easeInOut",
        repeat:   Infinity,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Vignette — static depth framing
// ─────────────────────────────────────────────────────────────────────────────
function Vignette() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 34%, rgba(0,0,0,0.54) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.38), transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public export
// ─────────────────────────────────────────────────────────────────────────────
export function AmbientEffects({ toScreenRect, regions, hoveredId }: AmbientEffectsProps) {
  const reduced = useReducedMotion();

  // ── CRT — position from sceneEffects.crtScreen ────────────────────────────
  const crt = sceneEffects.crtScreen;
  const crtRect = toScreenRect(
    crt.x - crt.width / 2,  crt.y - crt.height / 2,
    crt.x + crt.width / 2,  crt.y + crt.height / 2,
  );

  // ── Museum door crack — position from sceneEffects.museumDoorCrack ────────
  const crack = sceneEffects.museumDoorCrack;
  const crackRect = toScreenRect(
    crack.x - crack.width / 2,  crack.y - crack.height / 2,
    crack.x + crack.width / 2,  crack.y + crack.height / 2,
  );

  // ── Cassette LED — position from sceneEffects.cassetteLED ─────────────────
  const led = sceneEffects.cassetteLED;
  const ledRect = toScreenRect(
    led.x - led.radius, led.y - led.radius,
    led.x + led.radius, led.y + led.radius,
  );
  const ledCX = ledRect.left + ledRect.width  / 2;
  const ledCY = ledRect.top  + ledRect.height / 2;
  const ledR  = ledRect.width / 2;

  // ── Bulbs + lava lamp — position from sceneRegions (unchanged) ────────────
  const leftBulbRect  = toScreenRect(regions.leftBulb.x1,  regions.leftBulb.y1,  regions.leftBulb.x2,  regions.leftBulb.y2);
  const shelfBulbRect = toScreenRect(regions.shelfBulb.x1, regions.shelfBulb.y1, regions.shelfBulb.x2, regions.shelfBulb.y2);
  const doorBulbRect  = toScreenRect(regions.doorBulb.x1,  regions.doorBulb.y1,  regions.doorBulb.x2,  regions.doorBulb.y2);
  const lavaRect      = toScreenRect(regions.lavaLamp.x1,  regions.lavaLamp.y1,  regions.lavaLamp.x2,  regions.lavaLamp.y2);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <CRTEffect
        rect={crtRect}
        rotation={crt.rotation}
        reduced={reduced}
        hovered={hoveredId === "crt-monitor"}
      />
      <BulbGlow rect={leftBulbRect}  glowRadius={3.2} delay={0}   reduced={reduced} />
      <BulbGlow rect={shelfBulbRect} glowRadius={2.8} delay={1.4} reduced={reduced} />
      <BulbGlow rect={doorBulbRect}  glowRadius={2.4} delay={0.7} color="rgba(255, 200, 80, 0.18)" reduced={reduced} />
      <LavaLampGlow rect={lavaRect} reduced={reduced} />
      <MuseumDoorCrack
        rect={crackRect}
        hovered={hoveredId === "museum-door"}
        reduced={reduced}
      />
      <CassetteIndicator
        cx={ledCX}
        cy={ledCY}
        r={ledR}
        hovered={hoveredId === "cassette-player"}
        reduced={reduced}
      />
      <Vignette />
    </div>
  );
}
