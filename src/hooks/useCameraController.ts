/**
 * useCameraController
 * ─────────────────────────────────────────────────────────────────────────────
 * Unified camera motion for the hero scene. Combines three layers:
 *
 *   1. Mouse parallax   — tight tracking of cursor position (±10 px)
 *   2. Idle drift       — slow sine-wave oscillation when mouse is still >3.5 s
 *   3. Focus bias       — subtle pull toward the hovered/active scene object
 *
 * Returns { x, y, scale } as plain numbers intended for a Framer Motion
 * `animate` prop with per-key spring transitions defined in the consumer.
 *
 * Respects prefers-reduced-motion: returns neutral values and exits immediately.
 */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";
import type { Region } from "@/data/sceneRegions";

// Source image canonical dimensions (must match sceneRegions.ts coordinate space)
const SCENE_W = 1536;
const SCENE_H = 1024;

// ── Tuning constants ──────────────────────────────────────────────────────────
const PARALLAX_STRENGTH   = 10;    // max pixels of mouse parallax
const HOVER_BIAS_FACTOR   = 0.013; // fraction of viewport to bias on hover
const ACTIVE_BIAS_FACTOR  = 0.021; // fraction of viewport to bias on open
const DRIFT_AMP_X         = 3;     // px, idle drift X amplitude
const DRIFT_AMP_Y         = 1.8;   // px, idle drift Y amplitude
const IDLE_THRESHOLD_MS   = 3500;  // ms before idle drift starts
const IDLE_FADE_DURATION  = 2000;  // ms for drift to fully fade in/out
const BASE_SCALE          = 1.06;  // scale without any interaction
const HOVER_SCALE         = 1.075; // scale on hotspot hover
const ACTIVE_SCALE        = 1.09;  // scale when panel is open

export interface CameraState {
  x: number;
  y: number;
  scale: number;
}

interface Options {
  /** Region currently hovered by the cursor (null if none). */
  hoveredRegion: Region | null;
  /** Region of the currently open panel/interaction (null if none). Overrides hover. */
  activeRegion: Region | null;
}

export function useCameraController({ hoveredRegion, activeRegion }: Options): CameraState {
  const [camera, setCamera] = useState<CameraState>({ x: 0, y: 0, scale: BASE_SCALE });
  const reducedMotion = useReducedMotion();

  // Use refs so the RAF loop always reads current values without restarting
  const mouseRef         = useRef({ x: 0, y: 0 });
  const mouseLastMoveRef = useRef(Date.now());
  const rafRef           = useRef<number | null>(null);
  const hoveredRef       = useRef(hoveredRegion);
  const activeRef        = useRef(activeRegion);
  hoveredRef.current = hoveredRegion;
  activeRef.current  = activeRegion;

  useEffect(() => {
    if (reducedMotion) {
      setCamera({ x: 0, y: 0, scale: BASE_SCALE });
      return;
    }

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      mouseLastMoveRef.current = Date.now();
    };
    window.addEventListener("mousemove", onMove);

    const tick = (t: number) => {
      const { x: mx, y: my } = mouseRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // ── 1. Mouse parallax ─────────────────────────────────────────────────
      const halfW = vw / 2;
      const halfH = vh / 2;
      const parallaxX = ((mx - halfW) / halfW) * PARALLAX_STRENGTH;
      const parallaxY = ((my - halfH) / halfH) * PARALLAX_STRENGTH;

      // ── 2. Idle drift ─────────────────────────────────────────────────────
      const idleMs     = Date.now() - mouseLastMoveRef.current;
      const idleFactor = Math.min(1, Math.max(0, (idleMs - IDLE_THRESHOLD_MS) / IDLE_FADE_DURATION));
      const driftX     = Math.sin(t * 0.00018) * DRIFT_AMP_X * idleFactor;
      const driftY     = Math.sin(t * 0.00012 + 1.4) * DRIFT_AMP_Y * idleFactor;

      // ── 3. Focus bias toward hovered / active region ──────────────────────
      const region      = activeRef.current ?? hoveredRef.current;
      const biasFactor  = activeRef.current ? ACTIVE_BIAS_FACTOR
                        : hoveredRef.current ? HOVER_BIAS_FACTOR
                        : 0;
      let biasX = 0, biasY = 0;
      if (region && biasFactor > 0) {
        // Normalized center of region in source-image space (0–1)
        const nx = ((region.x1 + region.x2) / 2) / SCENE_W;
        const ny = ((region.y1 + region.y2) / 2) / SCENE_H;
        // Translate scene so the object moves toward the viewport center
        biasX = (0.5 - nx) * vw * biasFactor;
        biasY = (0.5 - ny) * vh * biasFactor;
      }

      const scale = activeRef.current  ? ACTIVE_SCALE
                  : hoveredRef.current ? HOVER_SCALE
                  : BASE_SCALE;

      setCamera({
        x: parallaxX + driftX + biasX,
        y: parallaxY + driftY + biasY,
        scale,
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return camera;
}
