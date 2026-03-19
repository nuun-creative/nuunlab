"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { SceneImage } from "./SceneImage";
import { HotspotLayer } from "./HotspotLayer";
import { AmbientEffects } from "./AmbientEffects";
import { SceneOverlay } from "./SceneOverlay";
import { PanelModal } from "./PanelModal";
import { CalibrationOverlay } from "./CalibrationOverlay";
import { EffectCalibrationOverlay } from "./EffectCalibrationOverlay";
import { CassetteModal } from "./CassetteModal";
import { RobotOverlay } from "./RobotOverlay";
import { RobotModal } from "./RobotModal";
import { useSceneCoords } from "@/hooks/useSceneCoords";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useScenePan } from "@/hooks/useScenePan";
import { useCameraController } from "@/hooks/useCameraController";
import { hotspots } from "@/data/hotspots";
import { panels } from "@/data/panels";
import { sceneRegions, DEBUG_REGIONS } from "@/data/sceneRegions";
import { DEBUG_EFFECTS } from "@/data/sceneEffects";
import type { Hotspot, Panel } from "@/types/scene";
import { LabEvents } from "@/lib/analytics";

export function HeroScene() {
  const [activePanel,   setActivePanel]   = useState<Panel | null>(null);
  const [cassetteOpen,  setCassetteOpen]  = useState(false);
  const [robotOpen,     setRobotOpen]     = useState(false);
  const [hoveredId,     setHoveredId]     = useState<string | null>(null);
  const audioPlayer = useAudioPlayer();

  // ── Scroll track (mobile pan only) ────────────────────────────────────────
  const trackRef = useRef<HTMLDivElement>(null);

  /**
   * sceneInnerRef — the single shared transform container.
   * ALL positioned layers (image, ambient, hotspots, calibration) live here.
   * The camera controller's motion is applied to this element.
   * useSceneCoords observes this element's dimensions (pre-transform).
   */
  const sceneInnerRef = useRef<HTMLDivElement>(null);

  const { isMobile, panX, trackWidth, minPan, handleDragEnd, focusedZone } =
    useScenePan();

  const { toScreen, toScreenRect, imageRect } = useSceneCoords(
    sceneInnerRef as React.RefObject<HTMLElement | null>,
  );

  // ── Derive the regions to feed the camera controller ──────────────────────
  // hoveredRegion: the scene region currently under the cursor
  const hoveredHotspot = hoveredId
    ? hotspots.find((h) => h.id === hoveredId) ?? null
    : null;

  // activeRegion: the region belonging to whichever interaction is open
  const activeHotspot = activePanel
    ? hotspots.find((h) => h.panelId === activePanel.id) ?? null
    : cassetteOpen
    ? hotspots.find((h) => h.panelId === "panel-cassette") ?? null
    : robotOpen
    ? hotspots.find((h) => h.panelId === "panel-robot") ?? null
    : null;

  const camera = useCameraController({
    hoveredRegion: hoveredHotspot?.region ?? null,
    activeRegion:  activeHotspot?.region  ?? null,
  });

  const handleHotspotClick = (hotspot: Hotspot) => {
    LabEvents.hotspotClick(hotspot.id);
    if (hotspot.panelId === "panel-cassette") {
      LabEvents.modalOpen("panel-cassette");
      setCassetteOpen(true);
      return;
    }
    if (hotspot.panelId === "panel-robot") {
      LabEvents.modalOpen("panel-robot");
      setRobotOpen(true);
      return;
    }
    const panel = panels[hotspot.panelId] ?? null;
    if (panel) LabEvents.modalOpen(panel.id);
    setActivePanel(panel);
  };

  return (
    <section
      className="relative overflow-hidden bg-black"
      style={{ width: "100vw", height: "100dvh" }}
      aria-label="NUUN Creative Lab interactive scene"
    >
      {/*
        ── Scene track ──────────────────────────────────────────────────────
        Mobile horizontal drag/snap only.
      */}
      <motion.div
        ref={trackRef}
        className="absolute inset-y-0 left-0"
        style={{
          width:       isMobile ? (trackWidth || "100%") : "100%",
          height:      "100%",
          x:           panX,
          touchAction: "pan-y",
        }}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: minPan || 0, right: 0 }}
        dragElastic={0.08}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: "grabbing" }}
      >
        {/*
          ── Scene inner — THE SINGLE SHARED TRANSFORM CONTAINER ──────────
          Camera motion (parallax + idle drift + focus bias) applied here.
          Scale(1.06+) ensures translate motion never exposes black edges.
          Mobile: no camera motion (track handles lateral panning instead).

          Per-key spring config:
            x/y   — tight spring, mimics previous 0.08s linear for parallax
            scale — slow spring for cinematic focus transitions
        */}
        <motion.div
          ref={sceneInnerRef}
          className="absolute inset-0 will-change-transform"
          animate={
            !isMobile
              ? { x: camera.x, y: camera.y, scale: camera.scale }
              : { x: 0, y: 0, scale: 1 }
          }
          transition={{
            x:     { type: "spring", stiffness: 320, damping: 32, mass: 0.55 },
            y:     { type: "spring", stiffness: 320, damping: 32, mass: 0.55 },
            scale: { type: "spring", stiffness: 65,  damping: 20, mass: 0.9  },
          }}
        >
          {/* Layer 0 — source artwork */}
          <SceneImage
            src="/images/hero-lab.jpg"
            alt="NUUN Creative Lab interior — workbench with CRT monitor, whiteboard, and museum door"
          />

          {/* Layer 1 — object-bound ambient effects (CRT, bulbs, lava lamp, door crack) */}
          <AmbientEffects
            toScreenRect={toScreenRect}
            regions={sceneRegions}
            hoveredId={hoveredId}
          />

          {/* Layer 2 — interactive hotspot regions */}
          <HotspotLayer
            hotspots={hotspots}
            toScreen={toScreen}
            toScreenRect={toScreenRect}
            isMobile={isMobile}
            focusedZoneId={focusedZone}
            onHotspotClick={handleHotspotClick}
            onHotspotHover={isMobile ? undefined : setHoveredId}
          />

          {/* Layer 3 — robot ambient idle effects */}
          <RobotOverlay
            toScreenRect={toScreenRect}
            isHovered={hoveredId === "desk-robot"}
          />

          {/* Layer 4 — hitbox calibration overlay (toggle DEBUG_REGIONS in sceneRegions.ts) */}
          {DEBUG_REGIONS && (
            <CalibrationOverlay toScreenRect={toScreenRect} imageRect={imageRect} />
          )}

          {/* Layer 5 — effect calibration overlay (toggle DEBUG_EFFECTS in sceneEffects.ts) */}
          {DEBUG_EFFECTS && (
            <EffectCalibrationOverlay toScreenRect={toScreenRect} imageRect={imageRect} />
          )}
        </motion.div>
      </motion.div>

      {/*
        Fixed UI — intentionally OUTSIDE sceneInnerRef.
        These elements do not participate in the camera transform.
      */}
      <SceneOverlay isMobile={isMobile} />
      <PanelModal
        panel={activePanel}
        onClose={() => {
          if (activePanel) LabEvents.modalClose(activePanel.id);
          setActivePanel(null);
        }}
      />
      <CassetteModal
        isOpen={cassetteOpen}
        onClose={() => { LabEvents.modalClose("panel-cassette"); setCassetteOpen(false); }}
        player={audioPlayer}
      />
      <RobotModal
        isOpen={robotOpen}
        onClose={() => { LabEvents.modalClose("panel-robot"); setRobotOpen(false); }}
      />
    </section>
  );
}
