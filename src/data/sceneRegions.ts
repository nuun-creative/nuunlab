/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCENE REGIONS — source-image pixel coordinates
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Coordinate space: hero-lab.jpg natural dimensions — 1536 × 1024 px
 *
 * Runtime transform (useSceneCoords):
 *   screenX = imageRect.left + (sourcePx / 1536) * imageRect.width
 *   screenY = imageRect.top  + (sourcePy / 1024) * imageRect.height
 *
 * All regions calibrated interactively via CalibrationOverlay.
 * Set DEBUG_REGIONS = true to re-enter calibration mode.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const DEBUG_REGIONS = false;

export interface Region {
  /** Left edge in source-image pixels */
  x1: number;
  /** Top edge in source-image pixels */
  y1: number;
  /** Right edge in source-image pixels */
  x2: number;
  /** Bottom edge in source-image pixels */
  y2: number;
  /** Human-readable label shown in debug mode */
  label?: string;
}

export const sceneRegions = {
  // ── Interactive hotspot regions ──────────────────────────────────────────

  /**
   * Cassette / tape deck on the desk — initial approximation.
   * Calibrate with DEBUG_REGIONS = true before shipping.
   */
  cassettePlayer: {
    x1: 1070, y1:  756,
    x2: 1291, y2:  827,
    label: "Cassette Player",
  },

  /**
   * Terminal device on the desk — initial approximation, calibrate with
   * DEBUG_REGIONS = true before shipping.
   */
  terminal: {
    x1:  150, y1:  650,
    x2:  432, y2:  774,
    label: "Terminal",
  },

  crtScreen: {
    x1:  152, y1:  430,
    x2:  367, y2:  556,
    label: "CRT Screen",
  },

  whiteboard: {
    x1:  538, y1:  471,
    x2:  932, y2:  681,
    label: "Whiteboard",
  },

  museumDoor: {
    x1: 1166, y1:  312,
    x2: 1443, y2:  726,
    label: "Museum Door",
  },

  ideaArchive: {
    x1:  938, y1:  598,
    x2: 1150, y2:  748,
    label: "Idea Archive",
  },

  deskRobot: {
    x1:  970, y1:  800,
    x2: 1060, y2:  870,
    label: "Desk Robot",
  },

  // ── Ambient light sources ────────────────────────────────────────────────

  leftBulb: {
    x1:  258, y1:  210,
    x2:  348, y2:  338,
    label: "Left Bulb",
  },

  shelfBulb: {
    x1: 1021, y1:  525,
    x2: 1123, y2:  641,
    label: "Shelf Bulb",
  },

  doorBulb: {
    x1: 1016, y1:  304,
    x2: 1116, y2:  404,
    label: "Door Bulb",
  },

  lavaLamp: {
    x1:   52, y1:  558,
    x2:  148, y2:  728,
    label: "Lava Lamp",
  },
} as const satisfies Record<string, Region>;

export type RegionKey = keyof typeof sceneRegions;
