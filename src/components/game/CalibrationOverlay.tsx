"use client";

import { useCallback, useEffect, useState } from "react";
import { SCENE_W, SCENE_H, type SceneCoords } from "@/hooks/useSceneCoords";
import { sceneRegions } from "@/data/sceneRegions";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type HotspotKey = "cassettePlayer" | "terminal" | "crtScreen" | "whiteboard" | "museumDoor" | "ideaArchive" | "deskRobot";
type AmbientKey = "leftBulb" | "shelfBulb" | "doorBulb" | "lavaLamp";
type RegionKey  = HotspotKey | AmbientKey;

interface Region {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
}

type Regions = Record<RegionKey, Region>;

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const HOTSPOT_KEYS: HotspotKey[] = ["cassettePlayer", "terminal", "crtScreen", "whiteboard", "museumDoor", "ideaArchive", "deskRobot"];
const AMBIENT_KEYS: AmbientKey[] = ["leftBulb", "shelfBulb", "doorBulb", "lavaLamp"];
const ALL_KEYS: RegionKey[] = [...HOTSPOT_KEYS, ...AMBIENT_KEYS];

const COLORS: Record<RegionKey, string> = {
  // Hotspots — solid borders
  cassettePlayer: "#ffa040",
  terminal:       "#ff4466",
  crtScreen:   "#00ff50",
  whiteboard:  "#00cfff",
  museumDoor:  "#ff9900",
  ideaArchive: "#ff00ff",
  deskRobot:   "#44ddff",
  // Ambient — dashed borders
  leftBulb:    "#ffe066",
  shelfBulb:   "#ffe066",
  doorBulb:    "#ffe066",
  lavaLamp:    "#00ffcc",
};

const isAmbient = (key: RegionKey): key is AmbientKey =>
  (AMBIENT_KEYS as RegionKey[]).includes(key);

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface CalibrationOverlayProps {
  toScreenRect: SceneCoords["toScreenRect"];
  imageRect: SceneCoords["imageRect"];
}

// ─────────────────────────────────────────────────────────────────────────────
// Info panel (bottom-left)
// ─────────────────────────────────────────────────────────────────────────────

function InfoPanel({ region, color, ambient }: { region: Region; color: string; ambient: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 48,
        left: 8,
        fontFamily: '"Courier New", monospace',
        fontSize: 12,
        color: "#ffffff",
        background: "rgba(0,0,0,0.88)",
        padding: "8px 12px",
        borderRadius: 4,
        border: `1px solid ${color}`,
        pointerEvents: "none",
        minWidth: 220,
        lineHeight: 1.6,
        zIndex: 200,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ color, fontWeight: "bold", fontSize: 13 }}>{region.label}</span>
        <span
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.45)",
            background: "rgba(255,255,255,0.08)",
            padding: "1px 5px",
            borderRadius: 3,
            letterSpacing: "0.05em",
          }}
        >
          {ambient ? "AMBIENT" : "HOTSPOT"}
        </span>
      </div>
      <div>
        x1: <strong>{region.x1}</strong> &nbsp; x2: <strong>{region.x2}</strong>
      </div>
      <div>
        y1: <strong>{region.y1}</strong> &nbsp; y2: <strong>{region.y2}</strong>
      </div>
      <div style={{ marginTop: 4, opacity: 0.65, fontSize: 11 }}>
        w: {region.x2 - region.x1} &nbsp; h: {region.y2 - region.y1}
      </div>
      <div
        style={{
          marginTop: 8,
          borderTop: "1px solid rgba(255,255,255,0.15)",
          paddingTop: 6,
          opacity: 0.5,
          fontSize: 10,
        }}
      >
        ↑↓←→ move &nbsp;·&nbsp; ⇧ ×10 &nbsp;·&nbsp; Alt+↑↓←→ resize
        <br />
        C copy all to clipboard
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function CalibrationOverlay({ toScreenRect, imageRect }: CalibrationOverlayProps) {
  const [regions, setRegions] = useState<Regions>(() => ({
    cassettePlayer: { ...sceneRegions.cassettePlayer },
    terminal:       { ...sceneRegions.terminal },
    crtScreen:   { ...sceneRegions.crtScreen },
    whiteboard:  { ...sceneRegions.whiteboard },
    museumDoor:  { ...sceneRegions.museumDoor },
    ideaArchive: { ...sceneRegions.ideaArchive },
    deskRobot:   { ...sceneRegions.deskRobot },
    leftBulb:    { ...sceneRegions.leftBulb },
    shelfBulb:   { ...sceneRegions.shelfBulb },
    doorBulb:    { ...sceneRegions.doorBulb },
    lavaLamp:    { ...sceneRegions.lavaLamp },
  }));

  const [selected, setSelected] = useState<RegionKey | null>(null);
  const [copied, setCopied] = useState(false);

  // ── Move ──────────────────────────────────────────────────────────────────
  const move = useCallback((key: RegionKey, dx: number, dy: number) => {
    setRegions((prev) => {
      const r = prev[key];
      return {
        ...prev,
        [key]: { ...r, x1: r.x1 + dx, y1: r.y1 + dy, x2: r.x2 + dx, y2: r.y2 + dy },
      };
    });
  }, []);

  // ── Resize (far edges) ────────────────────────────────────────────────────
  const resize = useCallback((key: RegionKey, dx: number, dy: number) => {
    setRegions((prev) => {
      const r = prev[key];
      return {
        ...prev,
        [key]: {
          ...r,
          x2: Math.max(r.x1 + 1, r.x2 + dx),
          y2: Math.max(r.y1 + 1, r.y2 + dy),
        },
      };
    });
  }, []);

  // ── Copy to clipboard ─────────────────────────────────────────────────────
  const copyToClipboard = useCallback((regs: Regions) => {
    const pad  = (n: number) => String(n).padStart(4, " ");
    const line = (key: string, r: Region) =>
      `  ${key.padEnd(12)}: ` +
      `{ x1: ${pad(r.x1)}, y1: ${pad(r.y1)}, x2: ${pad(r.x2)}, y2: ${pad(r.y2)},` +
      ` label: "${r.label}" },`;

    const text = [
      "  // ── Interactive hotspot regions ──",
      ...HOTSPOT_KEYS.map((k) => line(k, regs[k])),
      "",
      "  // ── Ambient light sources ──",
      ...AMBIENT_KEYS.map((k) => line(k, regs[k])),
    ].join("\n");

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => { /* silent */ });

    console.log("[CalibrationOverlay] Coordinates:\n" + text);
  }, []);

  // ── Keyboard handler ──────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "c" || e.key === "C") && !e.ctrlKey && !e.metaKey) {
        setRegions((current) => { copyToClipboard(current); return current; });
        return;
      }

      if (!selected) return;

      const ARROWS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (!ARROWS.includes(e.key)) return;
      e.preventDefault();

      const step = e.shiftKey ? 10 : 1;
      const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
      const dy = e.key === "ArrowUp"   ? -step : e.key === "ArrowDown"  ? step : 0;

      if (e.altKey) {
        resize(selected, dx, dy);
      } else {
        move(selected, dx, dy);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, move, resize, copyToClipboard]);

  return (
    <div className="absolute inset-0" style={{ zIndex: 100 }}>

      {/* ── Region boxes ──────────────────────────────────────────────────── */}
      {ALL_KEYS.map((key) => {
        const r = regions[key];
        const rect = toScreenRect(r.x1, r.y1, r.x2, r.y2);
        const color = COLORS[key];
        const isSelected = selected === key;
        const ambient = isAmbient(key);

        if (rect.width === 0) return null;

        return (
          <div
            key={key}
            onClick={(e) => { e.stopPropagation(); setSelected(key); }}
            style={{
              position: "absolute",
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
              // Hotspots: solid border. Ambient: dashed border.
              outline: isSelected
                ? `2px solid ${color}`
                : ambient
                  ? `1px dashed ${color}88`
                  : `1px solid ${color}88`,
              background: isSelected ? `${color}28` : `${color}0d`,
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            {/* Corner handles (selected only) */}
            {isSelected && (
              <>
                {[
                  { top: -4, left: -4 }, { top: -4, right: -4 },
                  { bottom: -4, left: -4 }, { bottom: -4, right: -4 },
                ].map((pos, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: 8, height: 8,
                      background: color,
                      borderRadius: 1,
                      pointerEvents: "none",
                      ...pos,
                    }}
                  />
                ))}
              </>
            )}

            {/* Label */}
            <div
              style={{
                position: "absolute",
                top: 4, left: 4,
                fontFamily: '"Courier New", monospace',
                fontSize: 10,
                fontWeight: "bold",
                color,
                background: "rgba(0,0,0,0.75)",
                padding: "1px 4px",
                pointerEvents: "none",
                lineHeight: 1.5,
                maxWidth: "90%",
              }}
            >
              {r.label}
              <br />
              <span style={{ opacity: 0.7 }}>{r.x1},{r.y1} → {r.x2},{r.y2}</span>
              <br />
              <span style={{ opacity: 0.5 }}>
                {Math.round(rect.left)},{Math.round(rect.top)}{" "}
                {Math.round(rect.width)}×{Math.round(rect.height)}px
              </span>
            </div>
          </div>
        );
      })}

      {/* ── Deselect on background click ──────────────────────────────────── */}
      <div
        style={{ position: "absolute", inset: 0, zIndex: -1 }}
        onClick={() => setSelected(null)}
      />

      {/* ── Info panel ────────────────────────────────────────────────────── */}
      {selected && (
        <InfoPanel
          region={regions[selected]}
          color={COLORS[selected]}
          ambient={isAmbient(selected)}
        />
      )}

      {/* ── Hint bar ──────────────────────────────────────────────────────── */}
      {!selected && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: '"Courier New", monospace',
            fontSize: 11,
            color: "rgba(255,255,255,0.6)",
            background: "rgba(0,0,0,0.7)",
            padding: "4px 12px",
            borderRadius: 4,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "#88ff88" }}>━━</span> hotspot &nbsp;
          <span style={{ color: "#ffee88", letterSpacing: 2 }}>╌╌</span> ambient &nbsp;·&nbsp;
          Click to select &nbsp;·&nbsp; C — copy all
        </div>
      )}

      {/* ── "Copied!" flash ───────────────────────────────────────────────── */}
      {copied && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: '"Courier New", monospace',
            fontSize: 12,
            fontWeight: "bold",
            color: "#00ff88",
            background: "rgba(0,0,0,0.88)",
            padding: "5px 14px",
            borderRadius: 4,
            border: "1px solid #00ff8866",
            pointerEvents: "none",
          }}
        >
          ✓ Copied to clipboard
        </div>
      )}

      {/* ── Image rect info ───────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 8, right: 8,
          fontFamily: '"Courier New", monospace',
          fontSize: 10,
          color: "#ffffff",
          background: "rgba(0,0,0,0.8)",
          padding: "4px 8px",
          borderRadius: 4,
          pointerEvents: "none",
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
