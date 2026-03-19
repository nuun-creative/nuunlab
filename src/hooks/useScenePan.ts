"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue } from "framer-motion";
import { SCENE_RATIO, SCENE_W } from "./useSceneCoords";

/**
 * Snap zones: x-center as a FRACTION of SCENE_W (source image).
 * Derived from sceneRegions centers — update when regions change.
 *
 *   crt:         (100+318)/2  = 209
 *   whiteboard:  (521+834)/2  = 677
 *   ideaArchive: (958+1132)/2 = 1045
 *   history:     (1153+1497)/2= 1325
 */
const SNAP_ZONES = [
  { id: "crt",         xFraction: 209  / SCENE_W },
  { id: "whiteboard",  xFraction: 677  / SCENE_W },
  { id: "ideaArchive", xFraction: 1045 / SCENE_W },
  { id: "history",     xFraction: 1325 / SCENE_W },
] as const;

export type SnapZoneId = (typeof SNAP_ZONES)[number]["id"];

export interface ScenePan {
  isMobile: boolean;
  panX: ReturnType<typeof useMotionValue<number>>;
  trackWidth: number;
  minPan: number;
  handleDragEnd: () => void;
  focusedZone: SnapZoneId;
  snapToZone: (id: SnapZoneId) => void;
}

export function useScenePan(): ScenePan {
  const [isMobile, setIsMobile] = useState(false);
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);
  const [focusedZone, setFocusedZone] = useState<SnapZoneId>("whiteboard");
  const panX = useMotionValue(0);

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /**
   * On mobile: track is wide enough that cover-fit produces no cropping.
   * At SCENE_RATIO × vh the container ratio === SCENE_RATIO exactly.
   */
  const trackWidth = isMobile ? Math.max(vw, SCENE_RATIO * vh) : vw;
  const minPan = Math.min(0, -(trackWidth - vw));

  const getSnapPanX = (xFraction: number): number => {
    const target = -(xFraction * trackWidth) + vw / 2;
    return Math.max(minPan, Math.min(0, target));
  };

  const snapToZone = (id: SnapZoneId) => {
    const zone = SNAP_ZONES.find((z) => z.id === id);
    if (!zone) return;
    setFocusedZone(id);
    animate(panX, getSnapPanX(zone.xFraction), { type: "spring", stiffness: 200, damping: 30 });
  };

  const handleDragEnd = () => {
    const currentX = panX.get();
    const viewCenterFraction = trackWidth > 0 ? (-currentX + vw / 2) / trackWidth : 0.5;

    let nearest = SNAP_ZONES[0];
    let minDist = Infinity;
    for (const zone of SNAP_ZONES) {
      const dist = Math.abs(zone.xFraction - viewCenterFraction);
      if (dist < minDist) {
        minDist = dist;
        nearest = zone;
      }
    }

    setFocusedZone(nearest.id);
    animate(panX, getSnapPanX(nearest.xFraction), {
      type: "spring",
      stiffness: 180,
      damping: 28,
    });
  };

  return { isMobile, panX, trackWidth, minPan, handleDragEnd, focusedZone, snapToZone };
}
