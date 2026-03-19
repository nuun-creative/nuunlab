"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type SceneCoords } from "@/hooks/useSceneCoords";
import { sceneRegions } from "@/data/sceneRegions";
import { sceneEffects } from "@/data/sceneEffects";

interface RobotOverlayProps {
  toScreenRect: SceneCoords["toScreenRect"];
  isHovered?: boolean;
}

/**
 * Ambient idle layer for UNIT-7 — lives inside sceneInnerRef so it
 * moves with the parallax container. pointer-events: none.
 *
 * Body glow: anchored to sceneRegions.deskRobot (the interaction hitbox).
 * Eye position: anchored to sceneEffects.robotEye (manually calibrated).
 * Eye color: computer-screen blue.
 */
export function RobotOverlay({ toScreenRect, isHovered = false }: RobotOverlayProps) {
  const shouldReduce = useReducedMotion();

  // ── Body glow — centered on the robot hitbox ──────────────────────────────
  const r = sceneRegions.deskRobot;
  const bodyRect = toScreenRect(r.x1, r.y1, r.x2, r.y2);

  // ── Eye — position from sceneEffects.robotEye ─────────────────────────────
  const eye = sceneEffects.robotEye;
  const eyeRect = toScreenRect(
    eye.x - eye.radius, eye.y - eye.radius,
    eye.x + eye.radius, eye.y + eye.radius,
  );
  const eyeX = eyeRect.left + eyeRect.width  / 2;
  const eyeY = eyeRect.top  + eyeRect.height / 2;
  const eyeR = Math.max(2, eyeRect.width / 2);

  if (bodyRect.width === 0) return null;

  const cx = bodyRect.left + bodyRect.width  / 2;
  const cy = bodyRect.top  + bodyRect.height / 2;

  return (
    <div
      className="absolute inset-0"
      style={{ pointerEvents: "none", zIndex: 5 }}
    >
      {/* Body glow halo — cool blue, brighter on hover */}
      <motion.div
        style={{
          position: "absolute",
          left: cx - bodyRect.width  * (isHovered ? 1.1 : 0.9),
          top:  cy - bodyRect.height * (isHovered ? 1.1 : 0.9),
          width:  bodyRect.width  * (isHovered ? 2.2 : 1.8),
          height: bodyRect.height * (isHovered ? 2.2 : 1.8),
          borderRadius: "50%",
          background: isHovered
            ? "radial-gradient(ellipse at center, rgba(80,160,255,0.28) 0%, rgba(60,130,255,0.10) 50%, transparent 72%)"
            : "radial-gradient(ellipse at center, rgba(70,150,255,0.18) 0%, rgba(50,120,255,0.06) 55%, transparent 75%)",
        }}
        animate={
          shouldReduce
            ? {}
            : {
                opacity: isHovered ? [0.75, 1, 0.75] : [0.6, 1, 0.6],
                scale:   isHovered ? [0.98, 1.05, 0.98] : [0.97, 1.03, 0.97],
              }
        }
        transition={{
          duration: isHovered ? 1.6 : 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Eye — computer-screen blue, brighter on hover, blink animation */}
      <motion.div
        style={{
          position: "absolute",
          left: eyeX - eyeR,
          top:  eyeY - eyeR,
          width:  eyeR * 2,
          height: eyeR * 2,
          borderRadius: "50%",
          background: isHovered
            ? "rgba(140, 220, 255, 1)"
            : "rgba(100, 200, 255, 0.9)",
          boxShadow: isHovered
            ? `0 0 ${eyeR * 5}px ${eyeR * 2}px rgba(80,190,255,0.75)`
            : `0 0 ${eyeR * 3}px ${eyeR}px rgba(70,180,255,0.6)`,
        }}
        animate={
          shouldReduce
            ? {}
            : {
                scaleY:  [1, 1, 1, 0.05, 1, 1],
                opacity: [0.9, 1, 0.9, 0.9, 1, 0.9],
              }
        }
        transition={{
          duration: isHovered ? 2.5 : 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.3, 0.44, 0.46, 0.5, 1],
        }}
      />
    </div>
  );
}
