"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Panel } from "@/types/scene";
import { LabEvents } from "@/lib/analytics";

interface PanelModalProps {
  panel: Panel | null;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI panel — interactive terminal
// ─────────────────────────────────────────────────────────────────────────────

type HistoryEntry = { type: "system" | "input" | "output" | "error"; text: string };

const BOOT: HistoryEntry[] = [
  { type: "system", text: "NUUN OS v0.1 — experimental build" },
  { type: "system", text: 'type "help" to see what this does' },
];

const COMMANDS: Record<string, () => string> = {
  help: () =>
    [
      "available commands:",
      "  about    — who we are and why it matters",
      "  work     — what we've built",
      "  contact  — start a conversation",
      "  clear    — clear the terminal",
    ].join("\n"),

  about: () =>
    [
      "NUUN Creative Lab — digital studio.",
      "",
      "We believe the internet should feel like",
      "discovery. Not a template. Not a brochure.",
      "Something made by a person, for people.",
      "",
      "People first. Craft second. Everything else",
      "figures itself out.",
    ].join("\n"),

  work: () =>
    [
      "Selected work:",
      "  → Interactive web experiences",
      "  → Brand identity & systems",
      "  → Creative direction",
      "  → Things that are hard to categorize",
      "",
      "  /concepts",
    ].join("\n"),

  contact: () =>
    [
      "We'd like to hear from you.",
      "",
      "  contact@nuun.dev",
      "  801-550-0241",
      "  /contact",
      "",
      "Seriously — reach out.",
    ].join("\n"),
};

function CLIPanel({ onClose }: { panel: Panel; onClose: () => void }) {
  const [history, setHistory] = useState<HistoryEntry[]>(BOOT);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const execute = (raw: string) => {
    const cmd = raw.trim().toLowerCase();

    if (cmd === "clear") {
      setHistory([]);
      return;
    }

    const entry: HistoryEntry = { type: "input", text: `> ${raw}` };

    if (!cmd) {
      setHistory((h) => [...h, entry]);
      return;
    }

    const handler = COMMANDS[cmd];
    const output: HistoryEntry = handler
      ? { type: "output", text: handler() }
      : { type: "error", text: `command not found: ${cmd}\ntype "help" for available commands` };

    setHistory((h) => [...h, entry, output]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      execute(input);
      setInput("");
    }
  };

  return (
    <div
      className="relative w-full max-w-lg mx-4 flex flex-col rounded overflow-hidden"
      style={{
        background: "#070a07",
        border: "1px solid rgba(74, 222, 128, 0.2)",
        boxShadow: "0 0 60px rgba(0,0,0,0.9), 0 0 30px rgba(74,222,128,0.06)",
        fontFamily: '"Courier New", "Lucida Console", monospace',
        height: "min(480px, 80dvh)",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Terminal"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{
          background: "rgba(74,222,128,0.06)",
          borderBottom: "1px solid rgba(74,222,128,0.15)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: "rgba(74,222,128,0.35)" }}
          />
          <span className="text-xs tracking-widest" style={{ color: "rgba(74,222,128,0.5)" }}>
            nuun_os — terminal
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close terminal"
          className="w-5 h-5 rounded-full flex items-center justify-center text-sm transition-opacity hover:opacity-80"
          style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}
        >
          ×
        </button>
      </div>

      {/* History */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3"
        style={{ scrollbarWidth: "none" }}
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, i) => (
          <div
            key={i}
            className="text-xs leading-6 whitespace-pre-wrap"
            style={{
              color:
                entry.type === "system"  ? "rgba(74,222,128,0.45)" :
                entry.type === "input"   ? "#4ade80" :
                entry.type === "error"   ? "rgba(255,100,100,0.8)" :
                                           "rgba(134,239,172,0.75)",
              marginBottom: entry.type === "output" || entry.type === "error" ? "0.75rem" : 0,
            }}
          >
            {entry.text}
          </div>
        ))}
      </div>

      {/* Input row */}
      <div
        className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(74,222,128,0.1)" }}
      >
        <span className="text-xs" style={{ color: "#4ade80" }}>
          &gt;
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="flex-1 bg-transparent outline-none text-xs"
          style={{
            color: "#4ade80",
            caretColor: "#4ade80",
            fontFamily: "inherit",
          }}
          aria-label="Terminal input"
        />
        <motion.span
          className="inline-block w-1.5 h-3.5 -mb-0.5"
          style={{ background: "#4ade80" }}
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Terminal panel — full scrollable manifesto, CRT-inspired
// ─────────────────────────────────────────────────────────────────────────────

function BlinkCursor() {
  return (
    <motion.span
      className="inline-block w-2 h-4 -mb-1"
      style={{ background: "#4ade80" }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

function TerminalPanel({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  return (
    <div
      className="relative w-full max-w-md mx-4 rounded overflow-hidden flex flex-col"
      style={{
        background: "#050f05",
        border: "1px solid rgba(74, 222, 128, 0.22)",
        boxShadow: "0 0 40px rgba(0,0,0,0.8), 0 0 20px rgba(74,222,128,0.08)",
        fontFamily: '"Courier New", "Lucida Console", monospace',
        maxHeight: "82dvh",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-title"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
        style={{
          background: "rgba(74, 222, 128, 0.07)",
          borderBottom: "1px solid rgba(74, 222, 128, 0.18)",
        }}
      >
        <span className="text-xs tracking-widest" style={{ color: "rgba(74,222,128,0.6)" }}>
          &gt;&nbsp;nuun_lab.manifesto
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-4 h-4 rounded-full flex items-center justify-center text-xs transition-opacity hover:opacity-80"
          style={{ background: "rgba(74, 222, 128, 0.2)", color: "#4ade80" }}
        >
          ×
        </button>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto px-5 py-5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(74,222,128,0.15) transparent" }}
      >
        <h2
          id="panel-title"
          className="text-lg font-bold mb-3 tracking-widest uppercase"
          style={{ color: "#4ade80" }}
        >
          {panel.title}
        </h2>

        {/* Lede */}
        {panel.body && (
          <p
            className="text-sm font-semibold mb-6 leading-relaxed"
            style={{ color: "#86efac" }}
          >
            {panel.body}
          </p>
        )}

        {/* Numbered sections */}
        {panel.sections?.map((section, i) => (
          <div
            key={i}
            style={{ marginBottom: i < (panel.sections?.length ?? 0) - 1 ? 28 : 16 }}
          >
            <div
              className="text-[9px] tracking-[0.25em] uppercase mb-1.5"
              style={{ color: "rgba(74,222,128,0.4)" }}
            >
              {section.label}
            </div>
            <div
              className="text-sm font-semibold mb-2 leading-snug"
              style={{ color: "#4ade80" }}
            >
              {section.heading}
            </div>
            <p
              className="text-xs leading-7 whitespace-pre-line"
              style={{ color: "rgba(134,239,172,0.72)" }}
            >
              {section.body}
            </p>
          </div>
        ))}

        <div className="mt-4">
          <BlinkCursor />
        </div>

        {panel.cta && (
          <div
            className="mt-6 pt-5"
            style={{ borderTop: "1px solid rgba(74,222,128,0.15)" }}
          >
            <Link href={panel.cta.href} onClick={() => { LabEvents.ctaClick(panel.cta!.label, panel.cta!.href); onClose(); }}>
              <button
                className="text-xs tracking-widest uppercase px-4 py-2 rounded transition-all hover:brightness-125"
                style={{
                  background: "rgba(74,222,128,0.1)",
                  border: "1px solid rgba(74,222,128,0.3)",
                  color: "#4ade80",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                &gt; {panel.cta.label} _
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Blueprint panel — whiteboard planning artifact
// ─────────────────────────────────────────────────────────────────────────────

const STEP_MARKER_COLORS = ["#1e40af", "#15803d", "#b45309"] as const;
const STEP_ROTATIONS    = [-3, 2, -1] as const;
const STEP_ANNOTATIONS  = [
  { text: "← listen first",   color: "#dc2626" },
  { text: "no bad ideas",     color: "#15803d" },
  { text: "ship it! ↗",      color: "#d97706" },
] as const;

function BlueprintPanel({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  return (
    <div
      className="relative w-full max-w-lg mx-4 overflow-hidden"
      style={{
        background: "#fefefe",
        backgroundImage: "radial-gradient(circle, #e2e2e2 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        backgroundPosition: "4px 4px",
        boxShadow: "0 0 50px rgba(0,0,0,0.75), 0 4px 20px rgba(0,0,0,0.2)",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-title"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Physical whiteboard ledge */}
      <div style={{ height: 6, background: "#d0d0d0", borderBottom: "1px solid #bbb" }} />

      {/* Header — written on the board, no chrome */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div
              className="text-[9px] tracking-[0.28em] uppercase mb-2"
              style={{ color: "#aaa", fontFamily: '"Courier New", monospace' }}
            >
              — BOARD —
            </div>
            <h2
              id="panel-title"
              className="text-2xl leading-none mb-1.5"
              style={{ fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em" }}
            >
              {panel.title}
            </h2>
            {panel.body && (
              <p className="text-sm italic mt-0.5" style={{ color: "#6b7280" }}>
                {panel.body}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-6 h-6 flex items-center justify-center text-lg rounded hover:bg-black/5 transition-colors flex-shrink-0 mt-0.5"
            style={{ color: "#aaa" }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Marker rule — like someone drew a line across the board */}
      <div style={{ height: 2, background: "#0f172a", margin: "0 24px" }} />

      {/* Steps */}
      <div className="px-6 pt-5 pb-5">
        {panel.steps?.map((step, i) => (
          <div key={i}>
            {/* Step row */}
            <div className="flex gap-4 items-start">
              {/* Hollow circle — hand-drawn feel via rotation */}
              <div
                className="flex-shrink-0 flex items-center justify-center font-black"
                style={{
                  width: 38,
                  height: 38,
                  border: `3px solid ${STEP_MARKER_COLORS[i]}`,
                  borderRadius: "50%",
                  fontSize: 15,
                  color: STEP_MARKER_COLORS[i],
                  transform: `rotate(${STEP_ROTATIONS[i]}deg)`,
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1 min-w-0">
                <div
                  className="font-black text-base uppercase tracking-wide mb-1.5"
                  style={{ color: "#0f172a" }}
                >
                  <span
                    style={{
                      borderBottom: `2.5px solid ${STEP_MARKER_COLORS[i]}`,
                      paddingBottom: 1,
                    }}
                  >
                    {step.title}
                  </span>
                </div>
                <div
                  className="text-sm leading-relaxed"
                  style={{ color: "#374151" }}
                >
                  {step.description}
                </div>
              </div>

              {/* Margin annotation — like a scribbled note */}
              <div
                className="flex-shrink-0 text-[9px] italic opacity-70 pt-2"
                style={{
                  color: STEP_ANNOTATIONS[i].color,
                  maxWidth: 58,
                  lineHeight: 1.45,
                  textAlign: "right",
                }}
              >
                {STEP_ANNOTATIONS[i].text}
              </div>
            </div>

            {/* Connector between steps — dashed line + arrow */}
            {i < (panel.steps?.length ?? 0) - 1 && (
              <div
                className="flex flex-col items-center"
                style={{ margin: "6px 0 6px 19px" }}
              >
                <div style={{ width: 1, height: 16, borderLeft: "2px dashed #ccc" }} />
                <span style={{ color: "#ccc", fontSize: 9, lineHeight: 1 }}>▼</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer — written in ink, not a button */}
      {panel.cta && (
        <div
          className="px-6 pb-5"
          style={{ borderTop: "1px dashed #ddd", paddingTop: 12 }}
        >
          <Link href={panel.cta.href} onClick={() => { LabEvents.ctaClick(panel.cta!.label, panel.cta!.href); onClose(); }}>
            <span
              className="text-sm font-bold cursor-pointer"
              style={{
                color: "#1e40af",
                borderBottom: "1.5px solid #1e40af",
                paddingBottom: 1,
              }}
            >
              {panel.cta.label} →
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// History exhibit visual artifacts — one per narrative section
// ─────────────────────────────────────────────────────────────────────────────

/** Section 01 — a personal homepage circa 1997–2002 */
function OldWebArtifact() {
  return (
    <div style={{ marginTop: 14 }}>
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.18em",
          color: "rgba(180,150,100,0.45)",
          marginBottom: 6,
          textTransform: "uppercase",
          fontFamily: '"Courier New", monospace',
        }}
      >
        ARTIFACT · Personal Homepage · circa 1997–2002
      </div>
      <div
        style={{
          border: "3px double #00bbcc",
          background: "#fffde7",
          padding: "10px 12px",
          fontSize: 11,
          color: "#000080",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {/* Title row */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span style={{ color: "#ff0000", fontWeight: "bold" }}>★ ★ </span>
          <span style={{ color: "#0000cc", fontWeight: "bold", fontSize: 13 }}>
            Welcome to My Homepage!
          </span>
          <span style={{ color: "#ff0000", fontWeight: "bold" }}> ★ ★</span>
        </div>

        {/* Hit counter */}
        <div style={{ textAlign: "center", marginBottom: 9 }}>
          <span style={{ fontSize: 10, color: "#555" }}>You are visitor </span>
          <span
            style={{
              fontFamily: '"Courier New", monospace',
              fontWeight: "bold",
              color: "#ff6600",
              fontSize: 12,
              letterSpacing: 1,
            }}
          >
            #00847291
          </span>
          <motion.span
            style={{ marginLeft: 6, fontSize: 9, color: "#ff0000", fontWeight: "bold" }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          >
            ● NEW!
          </motion.span>
        </div>

        {/* Nav links */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          {["♦ My Links", "♦ About Me", "♦ Guest Book", "♦ Photos", "♦ Fun Stuff"].map((link) => (
            <span
              key={link}
              style={{ color: "#0000ee", textDecoration: "underline", cursor: "default", fontSize: 10 }}
            >
              {link}
            </span>
          ))}
        </div>

        {/* Footer note */}
        <div
          style={{
            borderTop: "1px solid #00bbcc",
            paddingTop: 6,
            textAlign: "center",
            fontSize: 9,
            color: "#666",
            fontStyle: "italic",
          }}
        >
          Best viewed in Netscape Navigator 4.0 · Screen resolution 800×600
        </div>
      </div>
    </div>
  );
}

/** Section 02 — a wireframe of a generic modern homepage */
function ModernTemplateArtifact() {
  return (
    <div style={{ marginTop: 14 }}>
      <div
        style={{
          display: "inline-block",
          background: "#dc2626",
          color: "white",
          fontSize: 9,
          letterSpacing: "0.18em",
          padding: "2px 8px",
          marginBottom: 0,
          textTransform: "uppercase",
          fontFamily: '"Courier New", monospace',
        }}
      >
        EXHIBIT: THE TEMPLATE ERA
      </div>

      {/* Wireframe */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid rgba(180,150,100,0.1)",
          padding: 10,
        }}
      >
        {/* Nav bar */}
        <div
          style={{
            background: "#222",
            height: 18,
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
            gap: 8,
          }}
        >
          <div style={{ width: 36, height: 4, background: "#333", borderRadius: 2 }} />
          <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
            {[26, 22, 28, 24].map((w, j) => (
              <div key={j} style={{ width: w, height: 3, background: "#333", borderRadius: 2 }} />
            ))}
          </div>
        </div>

        {/* Hero */}
        <div
          style={{
            background: "#222",
            padding: "14px 10px",
            marginBottom: 6,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 8, color: "#444", letterSpacing: "0.15em", marginBottom: 4 }}>
            HERO IMAGE
          </div>
          <div style={{ fontSize: 9, color: "#333", marginBottom: 5 }}>
            Your Headline Here. Make It Punchy.
          </div>
          <div
            style={{
              display: "inline-block",
              border: "1px solid #3a3a3a",
              padding: "2px 10px",
              fontSize: 8,
              color: "#3a3a3a",
              letterSpacing: "0.1em",
            }}
          >
            [ CALL TO ACTION BUTTON ]
          </div>
        </div>

        {/* Value props */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginBottom: 6 }}
        >
          {["Value Prop 1", "Value Prop 2", "Value Prop 3"].map((v, j) => (
            <div key={j} style={{ background: "#222", padding: "7px 4px", textAlign: "center" }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  background: "#2a2a2a",
                  borderRadius: "50%",
                  margin: "0 auto 3px",
                }}
              />
              <div style={{ fontSize: 8, color: "#333" }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Logo strip */}
        <div
          style={{ background: "#1e1e1e", padding: "5px 8px", textAlign: "center" }}
        >
          <div style={{ fontSize: 7, color: "#333", letterSpacing: "0.2em", marginBottom: 3 }}>
            TRUSTED BY
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {[38, 32, 44, 36, 40].map((w, j) => (
              <div key={j} style={{ width: w, height: 6, background: "#2a2a2a", borderRadius: 1 }} />
            ))}
          </div>
        </div>
      </div>

      {/* Caption */}
      <div style={{ paddingTop: 6 }}>
        <p
          style={{
            margin: 0,
            fontSize: 10,
            fontStyle: "italic",
            color: "rgba(212,196,168,0.45)",
            fontFamily: "Georgia, serif",
            lineHeight: 1.65,
          }}
        >
          See anything familiar? Don&apos;t feel bad. Everyone did it. The tools made it easy.
          The results made it forgettable.
        </p>
      </div>
    </div>
  );
}

/** Section 03 — NUUN's counter-movement artifact */
function NuunResponseArtifact() {
  return (
    <div style={{ marginTop: 14 }}>
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.18em",
          color: "rgba(74,222,128,0.45)",
          marginBottom: 6,
          textTransform: "uppercase",
          fontFamily: '"Courier New", monospace',
        }}
      >
        OUR COUNTER-MOVEMENT
      </div>
      <div
        style={{
          border: "1px solid rgba(74,222,128,0.18)",
          background: "rgba(74,222,128,0.03)",
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            fontStyle: "italic",
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: "rgba(232,213,176,0.9)",
            marginBottom: 8,
            lineHeight: 1.5,
          }}
        >
          &ldquo;Something you didn&apos;t know you were looking for.&rdquo;
        </div>
        <div
          style={{
            fontSize: 11,
            color: "rgba(212,196,168,0.5)",
            lineHeight: 1.65,
          }}
        >
          Specific. Alive. Made for a person, not a persona. Rewarding to discover. Harder to forget.
        </div>
      </div>
    </div>
  );
}

const HISTORY_ARTIFACTS = [OldWebArtifact, ModernTemplateArtifact, NuunResponseArtifact];

// ─────────────────────────────────────────────────────────────────────────────
// Archive panel — museum exhibit with three-part history narrative
// ─────────────────────────────────────────────────────────────────────────────

function ArchivePanel({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  return (
    <div
      className="relative w-full max-w-md mx-4 overflow-hidden flex flex-col"
      style={{
        background: "#11100e",
        border: "1px solid rgba(180, 150, 100, 0.18)",
        boxShadow: "0 0 50px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,220,150,0.06)",
        color: "#d4c4a8",
        maxHeight: "82dvh",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-title"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Exhibit label header */}
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(180,150,100,0.14)",
          background: "rgba(180,150,100,0.04)",
        }}
      >
        <div>
          <div
            className="text-[10px] tracking-[0.25em] uppercase mb-0.5"
            style={{ color: "rgba(180,150,100,0.5)" }}
          >
            NUUN Creative Lab
          </div>
          <div
            className="text-[10px] tracking-[0.15em] uppercase"
            style={{ color: "rgba(180,150,100,0.35)" }}
          >
            Digital History · Exhibit №1
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          style={{ color: "rgba(180,150,100,0.5)" }}
        >
          ×
        </button>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto px-5 py-5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(180,150,100,0.15) transparent" }}
      >
        {/* Exhibit title */}
        <h2
          id="panel-title"
          className="text-xl font-normal mb-5 leading-tight"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: "#e8d5b0",
            paddingBottom: 16,
            borderBottom: "1px solid rgba(180,150,100,0.12)",
          }}
        >
          {panel.title}
        </h2>

        {/* Sections with visual artifacts */}
        {panel.sections ? (
          panel.sections.map((section, i) => {
            const Artifact = HISTORY_ARTIFACTS[i];
            const isLast = i === (panel.sections?.length ?? 0) - 1;
            return (
              <div
                key={i}
                style={{
                  marginBottom: isLast ? 0 : 32,
                  paddingBottom: isLast ? 0 : 32,
                  borderBottom: isLast ? "none" : "1px solid rgba(180,150,100,0.1)",
                }}
              >
                {/* Section label */}
                <div className="flex items-center gap-2 mb-2.5">
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: 12,
                      background: "rgba(255,165,60,0.5)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="text-[9px] tracking-[0.25em] uppercase"
                    style={{ color: "rgba(255,165,60,0.6)" }}
                  >
                    {section.label}
                  </span>
                </div>

                {/* Heading */}
                <h3
                  className="text-base font-semibold mb-3 leading-snug"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    color: "#e8d5b0",
                  }}
                >
                  {section.heading}
                </h3>

                {/* Body */}
                <p
                  className="text-sm leading-7 whitespace-pre-line"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    color: "rgba(212,196,168,0.72)",
                  }}
                >
                  {section.body}
                </p>

                {/* Visual artifact */}
                {Artifact && <Artifact />}
              </div>
            );
          })
        ) : (
          <p
            className="text-sm leading-7 mb-6 whitespace-pre-line"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: "rgba(212,196,168,0.78)",
            }}
          >
            {panel.body}
          </p>
        )}

        {panel.cta && (
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(180,150,100,0.12)" }}>
            <Link href={panel.cta.href} onClick={() => { LabEvents.ctaClick(panel.cta!.label, panel.cta!.href); onClose(); }}>
              <button
                className="text-[11px] tracking-[0.15em] uppercase px-4 py-2 transition-all hover:brightness-125"
                style={{
                  background: "rgba(180,150,100,0.08)",
                  border: "1px solid rgba(180,150,100,0.2)",
                  color: "rgba(180,150,100,0.7)",
                  fontFamily: "Georgia, serif",
                }}
              >
                {panel.cta.label} ›
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery panel — possibility gallery with concept tiles
// ─────────────────────────────────────────────────────────────────────────────

function GalleryPanel({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  return (
    <div
      className="relative w-full mx-4 overflow-hidden flex flex-col"
      style={{
        maxWidth: 680,
        background: "#0c1410",
        border: "1px solid rgba(74,222,128,0.12)",
        boxShadow: "0 0 60px rgba(0,0,0,0.9), 0 0 30px rgba(74,222,128,0.04)",
        maxHeight: "85dvh",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-title"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        className="px-6 pt-5 pb-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(74,222,128,0.1)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="panel-title"
              className="text-2xl font-black leading-tight mb-2"
              style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
            >
              What could your website{" "}
              <em style={{ color: "#4ade80", fontStyle: "italic" }}>feel</em>{" "}
              like?
            </h2>
            {panel.subtitle && (
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.45)", maxWidth: 500 }}
              >
                {panel.subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex-shrink-0 w-7 h-7 rounded flex items-center justify-center text-lg hover:bg-white/10 transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Concept grid */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(74,222,128,0.12) transparent" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {panel.concepts?.map((concept, i) => {
            const slug = concept.id.slice(8); // strip "concept-" prefix
            return (
              <Link
                key={concept.id}
                href={`/concepts/${slug}`}
                onClick={() => { LabEvents.conceptClick(concept.id); onClose(); }}
                style={{ display: "block", textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 4,
                    padding: "16px 16px",
                    transition: "border-color 0.15s, background 0.15s",
                    cursor: "pointer",
                    height: "100%",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(74,222,128,0.28)";
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(74,222,128,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.025)";
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 10, lineHeight: 1 }}>{concept.icon}</div>
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.2em",
                      color: "rgba(74,222,128,0.5)",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      fontFamily: '"Courier New", monospace',
                    }}
                  >
                    CONCEPT {String(i + 1).padStart(2, "0")} →
                  </div>
                  <div
                    style={{ fontSize: 14, fontWeight: 700, color: "#ffffff", marginBottom: 6, lineHeight: 1.3 }}
                  >
                    {concept.title}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>
                    {concept.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel router
// ─────────────────────────────────────────────────────────────────────────────

function PanelContent({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  switch (panel.variant) {
    case "cli":
      return <CLIPanel panel={panel} onClose={onClose} />;
    case "terminal":
      return <TerminalPanel panel={panel} onClose={onClose} />;
    case "blueprint":
      return <BlueprintPanel panel={panel} onClose={onClose} />;
    case "archive":
      return <ArchivePanel panel={panel} onClose={onClose} />;
    case "gallery":
      return <GalleryPanel panel={panel} onClose={onClose} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal shell with AnimatePresence
// ─────────────────────────────────────────────────────────────────────────────

export function PanelModal({ panel, onClose }: PanelModalProps) {
  useEffect(() => {
    if (!panel) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [panel, onClose]);

  useEffect(() => {
    document.body.style.overflow = panel ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [panel]);

  return (
    <AnimatePresence>
      {panel && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            key="panel"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{
              opacity: { duration: 0.18 },
              scale:   { type: "spring", stiffness: 240, damping: 24, mass: 0.7 },
              y:       { type: "spring", stiffness: 240, damping: 24, mass: 0.7 },
            }}
          >
            <div className="pointer-events-auto w-full flex justify-center">
              <PanelContent panel={panel} onClose={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
