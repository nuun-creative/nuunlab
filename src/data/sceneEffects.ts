/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCENE EFFECTS — source-image pixel coordinates for visual effect anchors
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Coordinate space: hero-lab.jpg natural dimensions — 1536 × 1024 px
 * Same space as sceneRegions.ts, but this file drives VISUAL EFFECTS,
 * not interaction hitboxes. These two systems are intentionally separate.
 *
 * Rect effects:  center (x, y), width, height, rotation (degrees)
 * Point effects: center (x, y), radius
 *
 * All values are in source-image pixels and are converted to screen pixels
 * at runtime via toScreenRect / toScreen from useSceneCoords.
 *
 * Set DEBUG_EFFECTS = true to enter effect calibration mode.
 * Adjust with EffectCalibrationOverlay, copy (C), paste here, set false.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const DEBUG_EFFECTS = false;

// ── Effect config types ───────────────────────────────────────────────────────

export interface RectEffect {
  kind: "rect";
  /** Center x in source-image pixels */
  x: number;
  /** Center y in source-image pixels */
  y: number;
  /** Width in source pixels */
  width: number;
  /** Height in source pixels */
  height: number;
  /** Clockwise rotation in degrees */
  rotation: number;
  label: string;
}

export interface PointEffect {
  kind: "point";
  /** Center x in source-image pixels */
  x: number;
  /** Center y in source-image pixels */
  y: number;
  /** Radius in source pixels */
  radius: number;
  label: string;
}

export type EffectConfig = RectEffect | PointEffect;

// ── Effect anchors ────────────────────────────────────────────────────────────

export const sceneEffects = {
  /**
   * CRT monitor screen — visual effect region with rotation support.
   * Rotation compensates for the slight angle of the monitor in the artwork.
   */
  crtScreen: {
    kind: "rect" as const,
    x: 262, y: 498, width: 215, height: 126, rotation: -2.5,
    label: "CRT Screen",
  },

  /**
   * Museum door light crack — narrow vertical glow at the door seam.
   */
  museumDoorCrack: {
    kind: "rect" as const,
    x: 1300, y: 519, width: 14, height: 403, rotation: 0,
    label: "Museum Door Crack",
  },

  /**
   * Cassette player indicator LED — small red dot on the deck face.
   */
  cassetteLED: {
    kind: "point" as const,
    x: 1093, y: 798, radius: 4,
    label: "Cassette LED",
  },

  /**
   * UNIT-7 robot eye — small computer-screen-blue glowing dot.
   */
  robotEye: {
    kind: "point" as const,
    x: 1022, y: 822, radius: 5,
    label: "Robot Eye",
  },
} satisfies Record<string, EffectConfig>;

export type EffectKey = keyof typeof sceneEffects;
