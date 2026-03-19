"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootScreenProps {
  visible: boolean;
  onComplete: () => void;
}

const LINES = [
  { text: "Initializing a better internet...", status: null,       statusColor: null,      lineDelay: 0.2  },
  { text: "Loading curiosity engine...",       status: "OK",       statusColor: "#4ade80", lineDelay: 0.85 },
  { text: "Checking for template fatigue...", status: "DETECTED", statusColor: "#f97316", lineDelay: 1.5  },
  { text: "Mounting wonder module...",         status: "READY",    statusColor: "#4ade80", lineDelay: 2.15 },
] as const;

const TAGLINE_DELAY   = 2.9;
const CTA_DELAY       = 3.35;
const PROGRESS_DURATION = CTA_DELAY - 0.2;
// Auto-advance: CTA appears + 3.5 s gives users time to read without feeling trapped
const AUTO_ADVANCE_MS = CTA_DELAY * 1000 + 3500;

export function BootScreen({ visible, onComplete }: BootScreenProps) {
  const advance = useCallback(() => {
    sessionStorage.setItem("nuun_visited", "1");
    onComplete();
  }, [onComplete]);

  // Enter key
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Enter") advance(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [visible, advance]);

  // Auto-advance
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(advance, AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [visible, advance]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none"
          style={{ background: "#080d08", fontFamily: '"Courier New", "Lucida Console", monospace' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: "easeInOut" } }}
        >
          {/* Title */}
          <motion.p
            className="text-2xl sm:text-3xl font-bold tracking-[0.3em] uppercase mb-12 text-center"
            style={{ color: "#4ade80" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.5 }}
          >
            NUUN Creative Lab
          </motion.p>

          {/* Boot lines */}
          <div className="w-full max-w-lg px-8 mb-6 space-y-3">
            {LINES.map((line, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 text-sm"
                style={{ color: "rgba(255,255,255,0.45)" }}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: line.lineDelay, duration: 0.25 }}
              >
                <span>{line.text}</span>
                {line.status && (
                  <motion.span
                    className="font-bold tracking-wider"
                    style={{ color: line.statusColor }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: line.lineDelay + 0.28, duration: 0.18 }}
                  >
                    {line.status}
                  </motion.span>
                )}
              </motion.div>
            ))}

            {/* Tagline */}
            <motion.div
              className="text-sm font-semibold pt-1"
              style={{ color: "#f97316" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: TAGLINE_DELAY, duration: 0.3 }}
            >
              ✦&nbsp; Something worth finding ahead.
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-lg px-8 mb-8">
            <div style={{ height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 1 }}>
              <motion.div
                style={{
                  height: "100%",
                  borderRadius: 1,
                  background: "linear-gradient(to right, #4ade80, #f97316)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.2, duration: PROGRESS_DURATION, ease: "linear" }}
              />
            </div>
          </div>

          {/* Footer */}
          <motion.p
            className="text-[10px] tracking-[0.18em] uppercase mb-8"
            style={{ color: "rgba(255,255,255,0.18)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            NUUN Creative Lab &nbsp;·&nbsp; v2026 &nbsp;·&nbsp; Making the internet interesting again.
          </motion.p>

          {/* CTA */}
          <motion.button
            onClick={advance}
            className="text-xs tracking-[0.22em] uppercase px-8 py-4 cursor-pointer transition-all hover:brightness-125 active:scale-95"
            style={{
              border: "1px solid rgba(74,222,128,0.4)",
              color: "#4ade80",
              background: "transparent",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: CTA_DELAY, duration: 0.4 }}
          >
            PRESS ENTER TO ENTER THE LAB →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
