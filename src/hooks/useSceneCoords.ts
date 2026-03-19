"use client";

import { type RefObject, useEffect, useState } from "react";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CANONICAL SOURCE IMAGE DIMENSIONS
 * ─────────────────────────────────────────────────────────────────────────────
 * These define the coordinate space for ALL scene elements.
 * Every hotspot, overlay, glow, and effect is authored in this pixel space
 * and converted to screen pixels at runtime by this hook.
 *
 * Update if hero-lab.jpg is ever replaced with a different resolution.
 */
export const SCENE_W = 1536;
export const SCENE_H = 1024;
export const SCENE_RATIO = SCENE_W / SCENE_H; // 1.5 (3:2)

export interface ScreenRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface SceneCoords {
  /**
   * Convert a source-image pixel coordinate to container-relative screen pixels.
   * @param sourcePx  X in source image space (0 → SCENE_W)
   * @param sourcePy  Y in source image space (0 → SCENE_H)
   */
  toScreen: (sourcePx: number, sourcePy: number) => { x: number; y: number };

  /**
   * Convert a source-image pixel rectangle to a container-relative CSS rect.
   * Used for positioning hotspot regions, glow overlays, CRT effect, etc.
   */
  toScreenRect: (x1: number, y1: number, x2: number, y2: number) => ScreenRect;

  /** The rendered image rect within the container (after cover scaling/offset). */
  imageRect: ScreenRect;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * useSceneCoords
 * ─────────────────────────────────────────────────────────────────────────────
 * Watches the container via ResizeObserver and computes where the cover-fit
 * image actually renders (accounting for aspect-ratio cropping).
 *
 * Returns toScreen / toScreenRect — the single transform used by every layer:
 *   source image pixels  →  container-relative screen pixels
 *
 * Usage:
 *   const trackRef = useRef<HTMLDivElement>(null)
 *   const { toScreen, toScreenRect } = useSceneCoords(trackRef)
 *   // then: style={{ left: toScreen(px, py).x, top: toScreen(px, py).y }}
 */
export function useSceneCoords(containerRef: RefObject<HTMLElement | null>): SceneCoords {
  const [imageRect, setImageRect] = useState<ScreenRect>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const cw = el.offsetWidth;
      const ch = el.offsetHeight;
      if (cw === 0 || ch === 0) return;

      const containerRatio = cw / ch;

      let width: number, height: number, left: number, top: number;

      if (containerRatio >= SCENE_RATIO) {
        // Container is wider than image: image fills width, top/bottom clipped
        width = cw;
        height = cw / SCENE_RATIO;
        left = 0;
        top = (ch - height) / 2;
      } else {
        // Container is taller than image: image fills height, sides clipped
        height = ch;
        width = ch * SCENE_RATIO;
        left = (cw - width) / 2;
        top = 0;
      }

      setImageRect({ left, top, width, height });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  /**
   * Core transform: source pixel → screen pixel.
   * scaleX = imageRect.width  / SCENE_W
   * scaleY = imageRect.height / SCENE_H
   */
  const toScreen = (sourcePx: number, sourcePy: number) => ({
    x: imageRect.left + (sourcePx / SCENE_W) * imageRect.width,
    y: imageRect.top + (sourcePy / SCENE_H) * imageRect.height,
  });

  const toScreenRect = (x1: number, y1: number, x2: number, y2: number): ScreenRect => {
    const tl = toScreen(x1, y1);
    const br = toScreen(x2, y2);
    return {
      left: tl.x,
      top: tl.y,
      width: Math.max(0, br.x - tl.x),
      height: Math.max(0, br.y - tl.y),
    };
  };

  return { toScreen, toScreenRect, imageRect };
}
