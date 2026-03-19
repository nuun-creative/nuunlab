"use client";

import type { SceneCoords } from "@/hooks/useSceneCoords";
import type { SnapZoneId } from "@/hooks/useScenePan";
import type { Hotspot as HotspotType } from "@/types/scene";
import { Hotspot } from "./Hotspot";

interface HotspotLayerProps {
  hotspots: HotspotType[];
  toScreen: SceneCoords["toScreen"];
  toScreenRect: SceneCoords["toScreenRect"];
  isMobile: boolean;
  focusedZoneId: SnapZoneId;
  onHotspotClick: (hotspot: HotspotType) => void;
  onHotspotHover?: (id: string | null) => void;
}

export function HotspotLayer({
  hotspots,
  toScreen,
  toScreenRect,
  isMobile,
  focusedZoneId,
  onHotspotClick,
  onHotspotHover,
}: HotspotLayerProps) {
  return (
    <div className="absolute inset-0" aria-label="Interactive scene objects">
      {hotspots.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          hotspot={hotspot}
          toScreen={toScreen}
          toScreenRect={toScreenRect}
          isMobile={isMobile}
          isFocused={hotspot.snapZoneId === focusedZoneId}
          onClick={onHotspotClick}
          onHover={onHotspotHover}
        />
      ))}
    </div>
  );
}
