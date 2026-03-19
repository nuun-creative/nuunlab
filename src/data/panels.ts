import type { Panel } from "@/types/scene";
import { CONCEPTS } from "./concepts";

/**
 * Panel content keyed by panelId.
 *
 * Object → panel mapping:
 *   CRT monitor    → panel-manifesto  (terminal variant — full scrollable manifesto)
 *   Whiteboard     → panel-process    (blueprint variant — whiteboard object)
 *   Museum Door    → panel-history    (archive variant — 3-part exhibit)
 *   Idea Archive   → panel-archive    (gallery variant — possibility gallery)
 */
export const panels: Record<string, Panel> = {
  // ── Terminal ──────────────────────────────────────────────────────────────
  "panel-terminal": {
    id: "panel-terminal",
    variant: "cli",
    title: "Terminal",
  },

  // ── CRT monitor ───────────────────────────────────────────────────────────
  "panel-manifesto": {
    id: "panel-manifesto",
    variant: "terminal",
    title: "The Manifesto",
    body: "Most websites work. Very few are remembered.",
    sections: [
      {
        label: "01 — THE PROBLEM",
        heading: "The internet used to feel like discovery.",
        body: "Not every page was polished. Not every experience was efficient. But it felt alive. You opened a browser and didn't know what you might find. Websites were strange, creative, personal — sometimes a little chaotic. People built things because they were curious. Because they wanted to show something to the world.",
      },
      {
        label: "02 — THE PATTERN",
        heading: "Somewhere along the way, we optimized the wonder out of it.",
        body: "A hero image. Three value propositions. A grid of logos. A call-to-action. Templates got cleaner. Brands got safer. Everything got easier to launch — and harder to care about. Today most websites are indistinguishable from each other. Efficient. Polished. Forgettable.",
      },
      {
        label: "03 — THE BELIEF",
        heading: "We think businesses deserve better than an online brochure.",
        body: "Not every website needs to break convention — but it should feel like someone made it. Someone who cared. Someone who understood what makes a brand worth paying attention to.\n\nWe build digital experiences that feel alive. Each one starts with a relationship — understanding what makes a business specific, human, worth remembering.",
      },
      {
        label: "04 — THE WORK",
        heading: "The internet should be interesting again.",
        body: "NUUN Creative is here to help build it. We make things that reward curiosity. That feel like they were made by a person, for people. That remember what the web is actually for.",
      },
    ],
    cta: {
      label: "Join the Revolution",
      href: "/contact",
    },
  },

  // ── Whiteboard ───────────────────────────────────────────────────────────
  "panel-process": {
    id: "panel-process",
    variant: "blueprint",
    title: "How We Build",
    body: "Three moves. Every project, every time.",
    steps: [
      {
        title: "Understand",
        description: "We learn the shape of your business, your audience, your ambition, and what makes you different. The goal is to understand what makes your brand worth paying attention to.",
      },
      {
        title: "Imagine",
        description: "We develop the creative concept, experience direction, and strategic structure. What kind of experience would make people feel the difference?",
      },
      {
        title: "Build",
        description: "Design and development with purpose, clarity, and room for delight. Nothing shipped without intention behind it.",
      },
    ],
    cta: {
      label: "See Our Concepts",
      href: "/concepts",
    },
  },

  // ── Museum Door ──────────────────────────────────────────────────────────
  "panel-history": {
    id: "panel-history",
    variant: "archive",
    title: "Before the Templates",
    sections: [
      {
        label: "01 — THE WONDER",
        heading: "The internet used to feel like discovery.",
        body: "Before the templates, the web was strange in the best way.\n\nPages loaded slowly but felt personal. Someone had made this — by hand, for a reason. People built portals about obscure hobbies, personal journals, fan archives for things that didn't deserve fan archives. The web was a place you went to find something you didn't expect to find.\n\nIt was imperfect. It was slow. It was alive.",
      },
      {
        label: "02 — THE DRIFT",
        heading: "Somewhere along the way, we optimized the wonder out of it.",
        body: "Then the tools got better. The frameworks arrived. Templates became the sensible choice.\n\nA hero section. Three value propositions. A testimonials row. A footer. Repeat. The web got faster, cleaner, and more interchangeable. Brands became safer. Personalities got smoothed out. Every company started to look like every other company, because they were all built from the same components.\n\nEfficient. Optimized. Forgettable.",
      },
      {
        label: "03 — THE RESPONSE",
        heading: "NUUN exists to bring it back.",
        body: "Not nostalgia for the weird old web. A belief that the things that made it feel human — curiosity, surprise, personality — still matter.\n\nDigital experiences should feel like someone made them. With intention, with craft, with a point of view. The internet doesn't need more websites. It needs more ideas.\n\nWe're here to make that happen.",
      },
    ],
    cta: {
      label: "Join the Revolution",
      href: "/contact",
    },
  },

  // ── Idea Archive ─────────────────────────────────────────────────────────
  "panel-archive": {
    id: "panel-archive",
    variant: "gallery",
    title: "The Possibility Gallery",
    subtitle: "Not just what could it say. What could it feel like to step into your brand? This is not a portfolio of templates. It's a gallery of possibilities.",
    concepts: CONCEPTS.map((c) => ({
      id: `concept-${c.slug}`,
      icon: c.icon,
      title: c.title,
      description: `${c.tagline} ${c.description}`,
    })),
  },
};
