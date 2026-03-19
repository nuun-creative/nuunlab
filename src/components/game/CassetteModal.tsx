"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playlist } from "@/data/playlist";
import type { AudioPlayer } from "@/hooks/useAudioPlayer";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmt(s: number): string {
  if (!isFinite(s) || isNaN(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Spool — cassette reel graphic
// ─────────────────────────────────────────────────────────────────────────────

function Spool({ spinning, reduced }: { spinning: boolean; reduced: boolean }) {
  return (
    <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
      {/* Static housing rings */}
      <svg
        width="52" height="52" viewBox="0 0 52 52"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      >
        <circle cx="26" cy="26" r="24" fill="#0e0b06" stroke="rgba(160,110,40,0.4)" strokeWidth="1.5" />
        <circle cx="26" cy="26" r="18" fill="#0b0807" stroke="rgba(130,90,30,0.25)" strokeWidth="1" />
      </svg>

      {/* Rotating hub + spokes */}
      <motion.svg
        width="52" height="52" viewBox="0 0 52 52"
        style={{ position: "absolute", inset: 0, transformOrigin: "26px 26px" }}
        animate={spinning && !reduced ? { rotate: 360 } : { rotate: 0 }}
        transition={
          spinning && !reduced
            ? { duration: 4, repeat: Infinity, ease: "linear" }
            : { duration: 0.4, ease: "easeOut" }
        }
        aria-hidden="true"
      >
        {/* Hub */}
        <circle cx="26" cy="26" r="5.5" fill="#1c1409" stroke="rgba(160,110,40,0.5)" strokeWidth="1" />
        {/* 4 spokes */}
        <line x1="26" y1="13" x2="26" y2="20" stroke="rgba(160,110,40,0.45)" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="32" x2="26" y2="39" stroke="rgba(160,110,40,0.45)" strokeWidth="2" strokeLinecap="round" />
        <line x1="13" y1="26" x2="20" y2="26" stroke="rgba(160,110,40,0.45)" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="26" x2="39" y2="26" stroke="rgba(160,110,40,0.45)" strokeWidth="2" strokeLinecap="round" />
        {/* Spoke tips */}
        <circle cx="26" cy="14"  r="1.5" fill="rgba(200,140,50,0.55)" />
        <circle cx="26" cy="38"  r="1.5" fill="rgba(200,140,50,0.55)" />
        <circle cx="14"  cy="26" r="1.5" fill="rgba(200,140,50,0.55)" />
        <circle cx="38"  cy="26" r="1.5" fill="rgba(200,140,50,0.55)" />
      </motion.svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cassette window
// ─────────────────────────────────────────────────────────────────────────────

function CassetteWindow({
  playing,
  reduced,
  tapeLabel,
}: {
  playing: boolean;
  reduced: boolean;
  tapeLabel?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        background: "#0a0704",
        border: "1.5px solid rgba(140,95,30,0.3)",
        borderRadius: 6,
        padding: "10px 14px",
        position: "relative",
      }}
      aria-hidden="true"
    >
      <Spool spinning={playing} reduced={reduced} />

      {/* Center label area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "0 10px",
        }}
      >
        {/* Tape strand top */}
        <div
          style={{
            width: "100%",
            height: 2,
            background:
              "linear-gradient(to right, rgba(80,55,20,0.6), rgba(60,40,15,0.4), rgba(80,55,20,0.6))",
          }}
        />

        {/* Cassette label */}
        <div
          style={{
            background: "#16110a",
            border: "1px solid rgba(140,95,30,0.2)",
            borderRadius: 3,
            padding: "4px 12px",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "rgba(180,130,50,0.5)",
              textTransform: "uppercase",
              lineHeight: 1.8,
            }}
          >
            NUUN SESSIONS
          </div>
          <div
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 8,
              letterSpacing: "0.15em",
              color: "rgba(140,100,40,0.4)",
              textTransform: "uppercase",
            }}
          >
            {tapeLabel ?? "SIDE A"}
          </div>
        </div>

        {/* Tape strand bottom */}
        <div
          style={{
            width: "100%",
            height: 2,
            background:
              "linear-gradient(to right, rgba(80,55,20,0.6), rgba(60,40,15,0.4), rgba(80,55,20,0.6))",
          }}
        />
      </div>

      <Spool spinning={playing} reduced={reduced} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VU meter — faked level animation
// ─────────────────────────────────────────────────────────────────────────────

// Pre-defined keyframe heights per bar (% of container)
const VU_FRAMES: number[][] = [
  [20, 85, 35, 70], [55, 25, 80, 45], [40, 90, 30, 75],
  [80, 50, 65, 85], [30, 70, 50, 40], [65, 40, 85, 55],
  [50, 80, 35, 70], [85, 50, 75, 30], [60, 75, 45, 85],
  [45, 95, 80, 40],
];

function VUMeter({ playing, reduced }: { playing: boolean; reduced: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 22, width: 44 }}
    >
      {VU_FRAMES.map((frames, i) => (
        <motion.div
          key={i}
          style={{
            width: 3,
            minHeight: 3,
            borderRadius: 1,
            background:
              i < 7
                ? "rgba(190,130,35,0.85)"
                : "rgba(210,70,40,0.85)",
          }}
          animate={
            playing && !reduced
              ? { height: frames.map((v) => `${v}%`) }
              : { height: "12%" }
          }
          transition={{
            duration: 0.38 + i * 0.04,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: i * 0.04,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Range slider (progress + volume)
// ─────────────────────────────────────────────────────────────────────────────

const SLIDER_STYLES = `
  .cas-range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 20px;
    background: transparent;
    cursor: pointer;
    outline: none;
    padding: 0;
    margin: 0;
  }
  .cas-range::-webkit-slider-runnable-track {
    height: 3px;
    background: rgba(130,90,25,0.25);
    border-radius: 2px;
  }
  .cas-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #c8902a;
    margin-top: -5px;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(200,144,42,0.4);
    transition: background 0.1s;
  }
  .cas-range:hover::-webkit-slider-thumb { background: #d4a853; }
  .cas-range:focus-visible::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px rgba(200,144,42,0.35), 0 0 5px rgba(200,144,42,0.4);
  }
  .cas-range::-moz-range-track {
    height: 3px;
    background: rgba(130,90,25,0.25);
    border-radius: 2px;
  }
  .cas-range::-moz-range-thumb {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #c8902a;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(200,144,42,0.4);
  }
`;

function ProgressBar({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  onSeek: (t: number) => void;
}) {
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div>
      {/* Visual track with fill */}
      <div
        style={{
          position: "relative",
          height: 3,
          background: "rgba(130,90,25,0.2)",
          borderRadius: 2,
          margin: "10px 0",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${pct}%`,
            background:
              "linear-gradient(to right, rgba(160,100,25,0.7), #c8902a)",
            borderRadius: 2,
            transition: "width 0.1s linear",
          }}
        />
        {/* Thumb dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${pct}%`,
            transform: "translate(-50%, -50%)",
            width: 11,
            height: 11,
            borderRadius: "50%",
            background: "#c8902a",
            boxShadow: "0 0 5px rgba(200,144,42,0.45)",
          }}
        />
      </div>

      {/* Native range on top (transparent, for interaction) */}
      <input
        type="range"
        className="cas-range"
        min={0}
        max={duration || 100}
        step={0.1}
        value={currentTime}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        aria-label="Seek"
        style={{
          position: "relative",
          marginTop: -23,
          opacity: 0,
          display: "block",
          zIndex: 1,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main modal content
// ─────────────────────────────────────────────────────────────────────────────

function CassettePlayer({ player, onClose }: { player: AudioPlayer; onClose: () => void }) {
  const reduced = useReducedMotion();
  const { state, controls, currentTrack } = player;
  const { isPlaying, currentTime, duration, volume, isLoading, hasError, currentIndex } = state;
  const { toggle, next, prev, seek, setVolume } = controls;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cassette Player"
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxWidth: 460,
        background: "#0b0906",
        border: "1px solid rgba(160,110,40,0.22)",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow:
          "0 0 60px rgba(0,0,0,0.92), 0 0 30px rgba(140,90,20,0.07), inset 0 1px 0 rgba(200,140,40,0.05)",
        fontFamily: '"Courier New", "Lucida Console", monospace',
      }}
    >
      <style>{SLIDER_STYLES}</style>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderBottom: "1px solid rgba(140,95,30,0.15)",
          background: "rgba(160,110,40,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: isPlaying ? "#c8902a" : "rgba(140,95,30,0.3)", display: "inline-block", boxShadow: isPlaying ? "0 0 6px rgba(200,144,42,0.5)" : "none", transition: "background 0.3s, box-shadow 0.3s" }} />
          <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(180,130,50,0.5)", textTransform: "uppercase" }}>
            NUUN TAPE DECK
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close cassette player"
          style={{
            width: 26, height: 26,
            borderRadius: 4,
            border: "1px solid rgba(140,95,30,0.25)",
            background: "rgba(255,255,255,0.03)",
            color: "rgba(180,130,50,0.55)",
            fontSize: 14,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.1s",
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: "14px 16px 18px" }}>
        {/* ── Cassette window ───────────────────────────────────────────── */}
        <CassetteWindow
          playing={isPlaying}
          reduced={reduced}
          tapeLabel={currentTrack.tapeLabel}
        />

        {/* ── Track info + VU meter ─────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginTop: 14,
            gap: 8,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {hasError ? (
              <div style={{ fontSize: 11, color: "rgba(200,80,60,0.8)", letterSpacing: "0.1em" }}>
                NO SIGNAL
              </div>
            ) : isLoading ? (
              <div style={{ fontSize: 11, color: "rgba(160,110,40,0.5)", letterSpacing: "0.1em" }}>
                LOADING...
              </div>
            ) : (
              <>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "#c8902a",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {currentTrack.title}
                </div>
                {currentTrack.description && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(160,110,40,0.55)",
                      letterSpacing: "0.05em",
                      marginTop: 3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {currentTrack.description}
                  </div>
                )}
              </>
            )}
          </div>

          <VUMeter playing={isPlaying} reduced={reduced} />
        </div>

        {/* ── Progress bar ──────────────────────────────────────────────── */}
        <div style={{ marginTop: 14 }}>
          <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "rgba(160,110,40,0.45)",
              letterSpacing: "0.05em",
              marginTop: 2,
            }}
          >
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* ── Transport controls ────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 16,
          }}
        >
          <TransportBtnSym
            label="First track"
            sym="⏮"
            onClick={() => controls.goToTrack(0)}
            disabled={currentIndex === 0}
          />
          <TransportBtnSym label="Previous" sym="◀◀" onClick={prev} />
          {/* Play/pause — large centre button */}
          <button
            onClick={toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 52, height: 52, minWidth: 52, minHeight: 52,
              borderRadius: 6,
              border: `1px solid ${isPlaying ? "rgba(200,140,40,0.7)" : "rgba(140,95,30,0.35)"}`,
              background: isPlaying ? "rgba(180,120,30,0.22)" : "rgba(255,255,255,0.04)",
              color: isPlaying ? "#d4a853" : "rgba(180,130,50,0.75)",
              fontSize: 20,
              cursor: "pointer",
              transition: "background 0.12s, border-color 0.12s",
              flexShrink: 0,
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <TransportBtnSym label="Next" sym="▶▶" onClick={next} />
          <TransportBtnSym
            label="Last track"
            sym="⏭"
            onClick={() => controls.goToTrack(playlist.length - 1)}
            disabled={currentIndex === playlist.length - 1}
          />
        </div>

        {/* ── Track list ────────────────────────────────────────────────── */}
        <div
          style={{
            marginTop: 16,
            borderTop: "1px solid rgba(140,95,30,0.12)",
            paddingTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {playlist.map((track, i) => (
            <button
              key={track.id}
              onClick={() => { controls.goToTrack(i); if (!isPlaying) controls.play(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 8px",
                borderRadius: 3,
                border: "none",
                background: i === currentIndex ? "rgba(160,110,30,0.12)" : "transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.1s",
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  color: i === currentIndex ? "#c8902a" : "rgba(140,95,30,0.4)",
                  width: 14,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {i === currentIndex && isPlaying ? "▶" : `${i + 1}.`}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: i === currentIndex ? "#c8902a" : "rgba(160,110,40,0.55)",
                  letterSpacing: "0.04em",
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {track.title}
              </span>
            </button>
          ))}
        </div>

        {/* ── Volume ────────────────────────────────────────────────────── */}
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{ fontSize: 9, color: "rgba(140,95,30,0.4)", letterSpacing: "0.15em", flexShrink: 0 }}
          >
            VOL
          </span>
          <div style={{ flex: 1, position: "relative" }}>
            <div
              style={{
                height: 3,
                background: "rgba(130,90,25,0.2)",
                borderRadius: 2,
                position: "relative",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0, top: 0,
                  height: "100%",
                  width: `${volume * 100}%`,
                  background: "linear-gradient(to right, rgba(140,90,20,0.6), rgba(180,120,30,0.7))",
                  borderRadius: 2,
                }}
              />
            </div>
            <input
              type="range"
              className="cas-range"
              min={0} max={1} step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume"
              style={{ position: "relative", marginTop: -23, opacity: 0, display: "block", zIndex: 1 }}
            />
          </div>
          <span style={{ fontSize: 9, color: "rgba(140,95,30,0.4)", letterSpacing: "0.05em", flexShrink: 0, width: 26, textAlign: "right" }}>
            {Math.round(volume * 100)}
          </span>
        </div>
      </div>
    </div>
  );
}

// Simple transport button that renders a text symbol
function TransportBtnSym({
  label,
  sym,
  onClick,
  disabled = false,
}: {
  label: string;
  sym: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, minWidth: 44, minHeight: 44,
        borderRadius: 4,
        border: "1px solid rgba(140,95,30,0.35)",
        background: "rgba(255,255,255,0.03)",
        color: "rgba(180,130,50,0.7)",
        fontSize: 11,
        fontFamily: '"Courier New", monospace',
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
        transition: "background 0.12s",
        flexShrink: 0,
      }}
    >
      {sym}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public export — modal shell with AnimatePresence
// ─────────────────────────────────────────────────────────────────────────────

interface CassetteModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: AudioPlayer;
}

export function CassetteModal({ isOpen, onClose, player }: CassetteModalProps) {
  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cas-backdrop"
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="cas-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 18 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pointer-events-auto w-full flex justify-center">
              <CassettePlayer player={player} onClose={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
