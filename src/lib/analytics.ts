/**
 * ─────────────────────────────────────────────────────────────────
 * NUUN Creative Lab — Analytics abstraction
 * ─────────────────────────────────────────────────────────────────
 *
 * All tracking calls go through this module.
 * To swap providers: change track() only — nothing else needs updating.
 *
 * Current provider: Google Analytics 4 (via NEXT_PUBLIC_GA_ID).
 * Wire additional providers here without touching components.
 * ─────────────────────────────────────────────────────────────────
 */

export type LabEventName =
  | "hotspot_click"
  | "modal_open"
  | "modal_close"
  | "cta_click"
  | "concept_click"
  | "cassette_play"
  | "cassette_pause"
  | "robot_prompt";

interface TrackPayload {
  label?: string;
  href?: string;
  value?: number;
  [key: string]: unknown;
}

/**
 * Central tracking function.
 * Guards against SSR and missing providers — always safe to call.
 */
export function track(event: LabEventName, payload?: TrackPayload): void {
  if (typeof window === "undefined") return;

  // Development: log to console for visibility
  if (process.env.NODE_ENV === "development") {
    console.log(`[analytics] ${event}`, payload ?? "");
    return;
  }

  // Google Analytics 4
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (gaId && "gtag" in window) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", event, {
      event_category: "lab",
      ...payload,
    });
  }
}

// ── Predefined event helpers ───────────────────────────────────────────────
// Use these in components — keeps event names consistent and typo-free.

export const LabEvents = {
  hotspotClick: (id: string) =>
    track("hotspot_click", { label: id }),

  modalOpen: (panelId: string) =>
    track("modal_open", { label: panelId }),

  modalClose: (panelId: string) =>
    track("modal_close", { label: panelId }),

  ctaClick: (label: string, href: string) =>
    track("cta_click", { label, href }),

  conceptClick: (conceptId: string) =>
    track("concept_click", { label: conceptId }),

  cassettePlay: (trackId: string) =>
    track("cassette_play", { label: trackId }),

  cassettePause: (trackId: string) =>
    track("cassette_pause", { label: trackId }),

  robotPrompt: (promptId: string) =>
    track("robot_prompt", { label: promptId }),
};
