"use client";

import { useCallback, useEffect, useState } from "react";
import { SCENE_W, SCENE_H, type SceneCoords } from "@/hooks/useSceneCoords";
import { sceneEffects, type EffectKey } from "@/data/sceneEffects";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface MutableRectEffect {
  kind: "rect";
  x: number; y: number;
  width: number; height: number;
  rotation: number;
  label: string;
}
interface MutablePointEffect {
  kind: "point";
  x: number; y: number;
  radius: number;
  label: string;
}
type MutableEffect = MutableRectEffect | MutablePointEffect;
type EffectsState = Record<EffectKey, MutableEffect>;

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const EFFECT_KEYS = Object.keys(sceneEffects) as EffectKey[];

const COLORS: Record<EffectKey, string> = {
  crtScreen:       "#00ff50", // CRT phosphor green
  museumDoorCrack: "#ffa040", // warm amber
  cassetteLED:     "#ff4040", // red LED
  robotEye:        "#44ddff", // computer screen blue
};

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface EffectCalibrationOverlayProps {
  toScreenRect: SceneCoords["toScreenRect"];
  imageRect: SceneCoords["imageRect"];
}

// ─────────────────────────────────────────────────────────────────────────────
// Info panel
// ─────────────────────────────────────────────────────────────────────────────

function InfoPanel({
  effectKey,
  effect,
  color,
}: {
  effectKey: EffectKey;
  effect: MutableEffect;
  color: string;
}) {
  void effectKey;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 48,
        left: 8,
        fontFamily: '"Courier New", monospace',
        fontSize: 12,
        color: "#ffffff",
        background: "rgba(0,0,0,0.90)",
        padding: "8px 12px",
        borderRadius: 4,
        border: `1px solid ${color}`,
        pointerEvents: "none",
        minWidth: 240,
        lineHeight: 1.65,
        zIndex: 200,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ color, fontWeight: "bold", fontSize: 13 }}>{effect.label}</span>
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
          {effect.kind.toUpperCase()}
        </span>
      </div>

      <div>x: <strong>{Math.round(effect.x)}</strong> &nbsp; y: <strong>{Math.round(effect.y)}</strong></div>

      {effect.kind === "rect" && (
        <>
          <div>w: <strong>{Math.round(effect.width)}</strong> &nbsp; h: <strong>{Math.round(effect.height)}</strong></div>
          <div>rot: <strong>{effect.rotation.toFixed(1)}°</strong></div>
        </>
      )}
      {effect.kind === "point" && (
        <div>radius: <strong>{effect.radius}</strong></div>
      )}

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
        {effect.kind === "rect" && (
          <>
            <br />
            [ ] rotate 0.5° &nbsp;·&nbsp; ⇧[ ] rotate 5°
          </>
        )}
        <br />
        C — copy all to clipboard
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Corner handle positions for selected rect
// ─────────────────────────────────────────────────────────────────────────────

const CORNERS = [
  { top: -4,  left: -4  },
  { top: -4,  right: -4 },
  { bottom: -4, left: -4  },
  { bottom: -4, right: -4 },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function EffectCalibrationOverlay({
  toScreenRect,
  imageRect,
}: EffectCalibrationOverlayProps) {
  const [effects, setEffects] = useState<EffectsState>(() => ({
    crtScreen:       { ...sceneEffects.crtScreen       },
    museumDoorCrack: { ...sceneEffects.museumDoorCrack },
    cassetteLED:     { ...sceneEffects.cassetteLED     },
    robotEye:        { ...sceneEffects.robotEye        },
  }));

  const [selectedKey, setSelectedKey] = useState<EffectKey | null>(null);
  const [copied, setCopied] = useState(false);

  // ── Move (x/y) ─────────────────────────────────────────────────────────────
  const move = useCallback((key: EffectKey, dx: number, dy: number) => {
    setEffects((prev) => ({
      ...prev,
      [key]: { ...prev[key], x: prev[key].x + dx, y: prev[key].y + dy },
    }));
  }, []);

  // ── Resize ─────────────────────────────────────────────────────────────────
  const resize = useCallback((key: EffectKey, dx: number, dy: number) => {
    setEffects((prev) => {
      const e = prev[key];
      if (e.kind === "rect") {
        return {
          ...prev,
          [key]: {
            ...e,
            width:  Math.max(1, e.width  + dx),
            height: Math.max(1, e.height + dy),
          },
        };
      } else {
        // Points: use whichever delta is non-zero (prefer dx)
        const dr = dx !== 0 ? dx : dy;
        return { ...prev, [key]: { ...e, radius: Math.max(1, e.radius + dr) } };
      }
    });
  }, []);

  // ── Rotate (rect only) ─────────────────────────────────────────────────────
  const rotate = useCallback((key: EffectKey, delta: number) => {
    setEffects((prev) => {
      const e = prev[key];
      if (e.kind !== "rect") return prev;
      return {
        ...prev,
        [key]: { ...e, rotation: Math.round((e.rotation + delta) * 10) / 10 },
      };
    });
  }, []);

  // ── Copy to clipboard ──────────────────────────────────────────────────────
  const copyToClipboard = useCallback((effs: EffectsState) => {
    const pad = (n: number) => String(Math.round(n)).padStart(4, " ");

    const lines = EFFECT_KEYS.map((key) => {
      const e = effs[key];
      const kPad = key.padEnd(16);
      if (e.kind === "rect") {
        return (
          `  ${kPad}: { kind: "rect",  ` +
          `x: ${pad(e.x)}, y: ${pad(e.y)}, ` +
          `width: ${pad(e.width)}, height: ${pad(e.height)}, ` +
          `rotation: ${e.rotation.toFixed(1)}, label: "${e.label}" },`
        );
      } else {
        return (
          `  ${kPad}: { kind: "point", ` +
          `x: ${pad(e.x)}, y: ${pad(e.y)}, ` +
          `radius: ${String(e.radius).padStart(3, " ")}, label: "${e.label}" },`
        );
      }
    });

    const text = lines.join("\n");
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {});
    console.log("[EffectCalibrationOverlay] Coordinates:\n" + text);
  }, []);

  // ── Keyboard handler ───────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // C — copy all (no modifier)
      if ((e.key === "c" || e.key === "C") && !e.ctrlKey && !e.metaKey) {
        setEffects((current) => { copyToClipboard(current); return current; });
        return;
      }

      // [ / ] — rotate (selected rect only)
      if (e.key === "[" || e.key === "]") {
        if (!selectedKey) return;
        e.preventDefault();
        const delta = (e.key === "]" ? 1 : -1) * (e.shiftKey ? 5 : 0.5);
        rotate(selectedKey, delta);
        return;
      }

      if (!selectedKey) return;

      const ARROWS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (!ARROWS.includes(e.key)) return;
      e.preventDefault();

      const step = e.shiftKey ? 10 : 1;
      const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
      const dy = e.key === "ArrowUp"   ? -step : e.key === "ArrowDown"  ? step : 0;

      if (e.altKey) {
        resize(selectedKey, dx, dy);
      } else {
        move(selectedKey, dx, dy);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedKey, move, resize, rotate, copyToClipboard]);

  // ── Coordinate helpers ─────────────────────────────────────────────────────
  const toScreenCenter = (cx: number, cy: number, w: number, h: number) =>
    toScreenRect(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2);

  return (
    <div className="absolute inset-0" style={{ zIndex: 100 }}>

      {/* ── Effect boxes ──────────────────────────────────────────────────── */}
      {EFFECT_KEYS.map((key) => {
        const e = effects[key];
        const color = COLORS[key];
        const isSelected = selectedKey === key;

        if (e.kind === "rect") {
          const r = toScreenCenter(e.x, e.y, e.width, e.height);
          if (r.width === 0) return null;

          return (
            <div
              key={key}
              onClick={(ev) => { ev.stopPropagation(); setSelectedKey(key); }}
              style={{
                position: "absolute",
                left: r.left,
                top: r.top,
                width: r.width,
                height: r.height,
                transform: `rotate(${e.rotation}deg)`,
                transformOrigin: "center",
                outline: isSelected
                  ? `2px solid ${color}`
                  : `1px solid ${color}88`,
                background: isSelected ? `${color}28` : `${color}0d`,
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              {/* Corner handles */}
              {isSelected && CORNERS.map((pos, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 8,
                    height: 8,
                    background: color,
                    borderRadius: 1,
                    pointerEvents: "none",
                    ...pos,
                  }}
                />
              ))}

              {/* Rotation indicator (selected only) */}
              {isSelected && e.rotation !== 0 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: -18,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: '"Courier New", monospace',
                    fontSize: 9,
                    color,
                    background: "rgba(0,0,0,0.75)",
                    padding: "1px 4px",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  {e.rotation.toFixed(1)}°
                </div>
              )}

              {/* Label */}
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  left: 4,
                  fontFamily: '"Courier New", monospace',
                  fontSize: 9,
                  fontWeight: "bold",
                  color,
                  background: "rgba(0,0,0,0.75)",
                  padding: "1px 4px",
                  pointerEvents: "none",
                  lineHeight: 1.5,
                  maxWidth: "90%",
                }}
              >
                {e.label}
                <br />
                <span style={{ opacity: 0.65, fontSize: 8 }}>
                  {Math.round(e.x)},{Math.round(e.y)} · {Math.round(e.width)}×{Math.round(e.height)}
                  {e.rotation !== 0 && ` · ${e.rotation.toFixed(1)}°`}
                </span>
              </div>
            </div>
          );
        } else {
          // Point effect — circle
          const r = toScreenCenter(e.x, e.y, e.radius, e.radius);
          if (r.width === 0) return null;

          const screenR = r.width / 2;
          const screenCX = r.left + screenR;
          const screenCY = r.top  + screenR;

          return (
            <div
              key={key}
              onClick={(ev) => { ev.stopPropagation(); setSelectedKey(key); }}
              style={{
                position: "absolute",
                left: screenCX - screenR,
                top:  screenCY - screenR,
                width:  screenR * 2,
                height: screenR * 2,
                borderRadius: "50%",
                outline: isSelected
                  ? `2px solid ${color}`
                  : `1px solid ${color}88`,
                background: isSelected ? `${color}28` : `${color}0d`,
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              {/* Center crosshair */}
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: `${color}55`, transform: "translateX(-50%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: `${color}55`, transform: "translateY(-50%)", pointerEvents: "none" }} />

              {/* Label — above circle */}
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 4px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: '"Courier New", monospace',
                  fontSize: 9,
                  fontWeight: "bold",
                  color,
                  background: "rgba(0,0,0,0.75)",
                  padding: "1px 4px",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  lineHeight: 1.5,
                }}
              >
                {e.label}
                <br />
                <span style={{ opacity: 0.65, fontSize: 8 }}>
                  {Math.round(e.x)},{Math.round(e.y)} · r{e.radius}
                </span>
              </div>
            </div>
          );
        }
      })}

      {/* ── Deselect on background click ───────────────────────────────────── */}
      <div
        style={{ position: "absolute", inset: 0, zIndex: -1 }}
        onClick={() => setSelectedKey(null)}
      />

      {/* ── Info panel ────────────────────────────────────────────────────── */}
      {selectedKey && (
        <InfoPanel
          effectKey={selectedKey}
          effect={effects[selectedKey]}
          color={COLORS[selectedKey]}
        />
      )}

      {/* ── Hint bar ──────────────────────────────────────────────────────── */}
      {!selectedKey && (
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
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          {EFFECT_KEYS.map((k) => (
            <span key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: effects[k].kind === "point" ? "50%" : 2, border: `1px solid ${COLORS[k]}` }} />
              <span style={{ color: COLORS[k], opacity: 0.8 }}>{effects[k].label}</span>
            </span>
          ))}
          <span style={{ opacity: 0.45 }}>· Click to select · C copy all</span>
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
            background: "rgba(0,0,0,0.90)",
            padding: "5px 14px",
            borderRadius: 4,
            border: "1px solid #00ff8866",
            pointerEvents: "none",
          }}
        >
          ✓ Copied to clipboard
        </div>
      )}

      {/* ── Source/rendered info ──────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          fontFamily: '"Courier New", monospace',
          fontSize: 10,
          color: "#ffffff",
          background: "rgba(0,0,0,0.8)",
          padding: "4px 8px",
          borderRadius: 4,
          pointerEvents: "none",
        }}
      >
        EFFECTS MODE
        <br />
        source: {SCENE_W}×{SCENE_H}
        <br />
        rendered: {Math.round(imageRect.width)}×{Math.round(imageRect.height)}
      </div>
    </div>
  );
}
