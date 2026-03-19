import type { Hotspot } from "@/types/scene";
import { sceneRegions } from "./sceneRegions";

/**
 * Object → panel mapping:
 *   CRT monitor   → panel-manifesto
 *   Whiteboard    → panel-process
 *   Museum Door   → panel-history
 *   Idea Archive  → panel-archive
 *
 * Hotspot x/y are the region centers in source-image pixels.
 * The region drives: hitbox bounds, hover highlight, CRT effect clip, mobile pulse ring.
 */
export const hotspots: Hotspot[] = [
  {
    id: "cassette-player",
    x: Math.round((sceneRegions.cassettePlayer.x1 + sceneRegions.cassettePlayer.x2) / 2),
    y: Math.round((sceneRegions.cassettePlayer.y1 + sceneRegions.cassettePlayer.y2) / 2),
    region: sceneRegions.cassettePlayer,
    label: "Cassette Player",
    panelId: "panel-cassette",
    snapZoneId: "ideaArchive",
  },
  {
    id: "terminal",
    x: Math.round((sceneRegions.terminal.x1 + sceneRegions.terminal.x2) / 2),
    y: Math.round((sceneRegions.terminal.y1 + sceneRegions.terminal.y2) / 2),
    region: sceneRegions.terminal,
    label: "Terminal",
    panelId: "panel-terminal",
    snapZoneId: "whiteboard",
  },
  {
    id: "crt-monitor",
    x: Math.round((sceneRegions.crtScreen.x1 + sceneRegions.crtScreen.x2) / 2),
    y: Math.round((sceneRegions.crtScreen.y1 + sceneRegions.crtScreen.y2) / 2),
    region: sceneRegions.crtScreen,
    label: "Read the Manifesto",
    panelId: "panel-manifesto",
    snapZoneId: "crt",
  },
  {
    id: "whiteboard",
    x: Math.round((sceneRegions.whiteboard.x1 + sceneRegions.whiteboard.x2) / 2),
    y: Math.round((sceneRegions.whiteboard.y1 + sceneRegions.whiteboard.y2) / 2),
    region: sceneRegions.whiteboard,
    label: "How We Build",
    panelId: "panel-process",
    snapZoneId: "whiteboard",
  },
  {
    id: "idea-archive",
    x: Math.round((sceneRegions.ideaArchive.x1 + sceneRegions.ideaArchive.x2) / 2),
    y: Math.round((sceneRegions.ideaArchive.y1 + sceneRegions.ideaArchive.y2) / 2),
    region: sceneRegions.ideaArchive,
    label: "Possibility Gallery",
    panelId: "panel-archive",
    snapZoneId: "ideaArchive",
  },
  {
    id: "museum-door",
    x: Math.round((sceneRegions.museumDoor.x1 + sceneRegions.museumDoor.x2) / 2),
    y: Math.round((sceneRegions.museumDoor.y1 + sceneRegions.museumDoor.y2) / 2),
    region: sceneRegions.museumDoor,
    label: "Before the Templates",
    panelId: "panel-history",
    snapZoneId: "history",
  },
  {
    id: "desk-robot",
    x: Math.round((sceneRegions.deskRobot.x1 + sceneRegions.deskRobot.x2) / 2),
    y: Math.round((sceneRegions.deskRobot.y1 + sceneRegions.deskRobot.y2) / 2),
    region: sceneRegions.deskRobot,
    label: "UNIT-7",
    panelId: "panel-robot",
    snapZoneId: "ideaArchive",
  },
];
