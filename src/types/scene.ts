import type { Region } from "@/data/sceneRegions";

export type { Region };

export interface Hotspot {
  id: string;
  /** Center X in source-image pixels (0 → SCENE_W = 1536) */
  x: number;
  /** Center Y in source-image pixels (0 → SCENE_H = 1024) */
  y: number;
  /** Clickable region in source-image pixels — drives hitbox, hover highlight */
  region: Region;
  label: string;
  panelId: string;
  /** Mobile snap zone this hotspot belongs to */
  snapZoneId: string;
}

/** A numbered exhibit section — used in terminal (manifesto) and archive (museum) panels */
export interface PanelSection {
  label: string;
  heading: string;
  body: string;
}

/** A concept tile in the possibility gallery */
export interface Concept {
  id: string;
  /** Emoji icon */
  icon: string;
  title: string;
  description: string;
}

export interface Panel {
  id: string;
  title: string;
  /** Short lede or subtitle — rendered below the title */
  subtitle?: string;
  body?: string;
  /** Drives the panel's visual style */
  variant: "terminal" | "blueprint" | "archive" | "gallery" | "cli";
  /** Numbered sections — used in terminal (manifesto) and archive (history) panels */
  sections?: PanelSection[];
  /** Optional step list rendered in blueprint panels */
  steps?: { title: string; description: string }[];
  /** Concept tiles for the gallery panel */
  concepts?: Concept[];
  cta?: {
    label: string;
    href: string;
  };
}
