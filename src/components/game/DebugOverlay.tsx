"use client";

import type { SceneCoords } from "@/hooks/useSceneCoords";
import { SCENE_W, SCENE_H } from "@/hooks/useSceneCoords";
import { sceneRegions, type Region } from "@/data/sceneRegions";

interface DebugOverlayProps {
  toScreenRect: SceneCoords["toScreenRect"];
  imageRect: SceneCoords["imageRect"];
}

const COLORS: Record<string, string> = {
  crtScreen:   "#00ff50",
  whiteboard:  "#00cfff",
  museumDoor:  "#ff9900",
  ideaArchive: "#ff00ff",
};

/** Only these regions are rendered in debug mode. */
const DEBUG_VISIBLE = new Set(["crtScreen", "whiteboard", "museumDoor", "ideaArchive"]);

function DebugBox({
  id,
  region,
  toScreenRect,
}: {
  id: string;
  region: Region;
  toScreenRect: SceneCoords["toScreenRect"];
}) {
  const rect = toScreenRect(region.x1, region.y1, region.x2, region.y2);
  const color = COLORS[id] ?? "#ffffff";

  if (rect.width === 0) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        outline: `2px solid ${color}`,
        background: `${color}22`,
      }}
    >
      {/* Label */}
      <div
        className="absolute top-1 left-1 text-[10px] font-bold leading-tight px-1"
        style={{
          background: "rgba(0,0,0,0.75)",
          color,
          fontFamily: '"Courier New", monospace',
          maxWidth: "90%",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        {region.label ?? id}
        <br />
        <span style={{ opacity: 0.7 }}>
          {region.x1},{region.y1} → {region.x2},{region.y2}
        </span>
        <br />
        <span style={{ opacity: 0.55 }}>
          {Math.round(rect.left)},{Math.round(rect.top)}{" "}
          {Math.round(rect.width)}×{Math.round(rect.height)}px
        </span>
      </div>
    </div>
  );
}

/**
 * Debug overlay — renders when DEBUG_REGIONS = true in sceneRegions.ts.
 *
 * Shows:
 *   - Bounding box for every region in sceneRegions
 *   - Source pixel coordinates (top-left label)
 *   - Computed screen coordinates and dimensions
 *   - Image rect info (bottom-left corner of scene)
 */
export function DebugOverlay({ toScreenRect, imageRect }: DebugOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
      {(Object.entries(sceneRegions) as [string, Region][])
        .filter(([id]) => DEBUG_VISIBLE.has(id))
        .map(([id, region]) => (
          <DebugBox key={id} id={id} region={region} toScreenRect={toScreenRect} />
        ))}

      {/* Image rect info */}
      <div
        className="absolute bottom-2 right-2 text-[10px] px-2 py-1 rounded"
        style={{
          background: "rgba(0,0,0,0.8)",
          color: "#ffffff",
          fontFamily: '"Courier New", monospace',
        }}
      >
        source: {SCENE_W}×{SCENE_H}
        <br />
        rendered: {Math.round(imageRect.width)}×{Math.round(imageRect.height)} @{" "}
        {Math.round(imageRect.left)},{Math.round(imageRect.top)}
      </div>
    </div>
  );
}
