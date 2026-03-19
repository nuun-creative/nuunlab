"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// Prompts + responses
// ─────────────────────────────────────────────────────────────────────────────

interface Prompt {
  id: string;
  label: string;
  response: string;
  closes?: boolean; // true = panel closes after delay
}

const PROMPTS: Prompt[] = [
  {
    id: "what-is-this",
    label: "What is this place?",
    response:
      "NUUN Creative Lab. They make things here — websites, brands, digital objects that feel like someone actually cared. The CRT over there has the full story. So does the whiteboard. The museum door, if you want to know where all this came from.",
  },
  {
    id: "what-click",
    label: "What should I click?",
    response:
      "Start with the CRT — that one explains everything. The whiteboard shows how we build. The museum door goes somewhere older. There's a terminal that talks back, if you know the right commands. I'd start wherever the light is brightest.",
  },
  {
    id: "why-robot",
    label: "Why are you a robot?",
    response:
      "Efficiency. The humans were busy with the interesting work.",
  },
  {
    id: "hidden",
    label: "Any hidden stuff?",
    response:
      "...The lava lamp has been running for eleven years. The cassette player has songs that don't exist anywhere else. And the terminal responds to things that aren't in the help menu.",
  },
  {
    id: "sleep",
    label: "Go back to sleep.",
    response: "Powering down. Until next time.",
    closes: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Eye blink animation (in-modal header)
// ─────────────────────────────────────────────────────────────────────────────

function RobotEye({ active }: { active: boolean }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: active ? "#ffdc64" : "#a07030",
        boxShadow: active ? "0 0 8px 3px rgba(255,210,60,0.55)" : "none",
        verticalAlign: "middle",
        marginBottom: 2,
      }}
      animate={
        shouldReduce || !active
          ? {}
          : { scaleY: [1, 1, 0.08, 1, 1], opacity: [1, 1, 1, 1, 1] }
      }
      transition={{
        duration: 4,
        repeat: Infinity,
        times: [0, 0.42, 0.44, 0.48, 1],
        ease: "easeInOut",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface RobotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RobotModal({ isOpen, onClose }: RobotModalProps) {
  const shouldReduce = useReducedMotion();
  const [response, setResponse]     = useState<string | null>(null);
  const [activeId, setActiveId]     = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setResponse(null);
      setActiveId(null);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    }
  }, [isOpen]);

  const handlePrompt = (prompt: Prompt) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveId(prompt.id);
    setResponse(prompt.response);
    if (prompt.closes) {
      closeTimerRef.current = setTimeout(onClose, 1800);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — click to close */}
          <motion.div
            key="robot-backdrop"
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.45)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduce ? 0 : 0.18 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="robot-panel"
            className="fixed z-50"
            style={{
              bottom: "clamp(24px, 5vh, 64px)",
              right:  "clamp(20px, 4vw, 80px)",
              width:  "clamp(260px, 28vw, 360px)",
              fontFamily: '"Courier New", monospace',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{
              duration: shouldReduce ? 0 : 0.22,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <div
              style={{
                background: "rgba(18, 12, 6, 0.97)",
                border: "1px solid rgba(255,160,40,0.35)",
                borderRadius: 8,
                boxShadow: "0 0 32px rgba(255,140,20,0.18), 0 8px 24px rgba(0,0,0,0.6)",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(255,160,40,0.18)",
                  background: "rgba(255,130,20,0.06)",
                }}
              >
                <RobotEye active={activeId !== "sleep"} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: "bold", color: "#ffa030", letterSpacing: "0.12em" }}>
                    UNIT-7
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,160,40,0.5)", letterSpacing: "0.08em" }}>
                    LAB ASSISTANT · ONLINE
                  </div>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "none",
                    color: "rgba(255,160,40,0.45)",
                    cursor: "pointer",
                    fontSize: 16,
                    lineHeight: 1,
                    padding: "2px 4px",
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Response area */}
              <div style={{ minHeight: 80, padding: "14px 16px" }}>
                <AnimatePresence mode="wait">
                  {response ? (
                    <motion.p
                      key={activeId}
                      style={{
                        margin: 0,
                        fontSize: 12,
                        lineHeight: 1.75,
                        color: "rgba(255,220,160,0.88)",
                      }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: shouldReduce ? 0 : 0.2 }}
                    >
                      {response}
                    </motion.p>
                  ) : (
                    <motion.p
                      key="idle"
                      style={{
                        margin: 0,
                        fontSize: 11,
                        color: "rgba(255,160,40,0.38)",
                        fontStyle: "italic",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: shouldReduce ? 0 : 0.15 }}
                    >
                      [ awaiting query ]
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(255,160,40,0.12)" }} />

              {/* Prompt buttons */}
              <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                {PROMPTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePrompt(p)}
                    style={{
                      background:
                        activeId === p.id
                          ? "rgba(255,140,20,0.14)"
                          : "rgba(255,140,20,0.05)",
                      border: `1px solid ${activeId === p.id ? "rgba(255,140,20,0.5)" : "rgba(255,140,20,0.18)"}`,
                      borderRadius: 4,
                      color:
                        activeId === p.id
                          ? "#ffa030"
                          : "rgba(255,180,80,0.65)",
                      cursor: "pointer",
                      fontFamily: '"Courier New", monospace',
                      fontSize: 11,
                      padding: "6px 10px",
                      textAlign: "left",
                      transition: "background 0.12s, border-color 0.12s, color 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      if (activeId !== p.id) {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,140,20,0.10)";
                        (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,180,80,0.9)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeId !== p.id) {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,140,20,0.05)";
                        (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,180,80,0.65)";
                      }
                    }}
                  >
                    &rsaquo; {p.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
