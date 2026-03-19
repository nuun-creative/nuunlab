/**
 * Canonical concept data.
 * Used by both the in-game gallery panel and the /concepts/* pages.
 */

export interface ConceptData {
  slug: string;
  title: string;
  /** Emoji icon for gallery tiles */
  icon: string;
  /** One-line audience statement */
  tagline: string;
  /** Short description for tiles and meta */
  description: string;
  /** Expanded "what this feels like" paragraph for concept pages */
  feels: string;
  /** Who this concept is built for — for concept pages */
  forBrands: string;
}

export const CONCEPTS: ConceptData[] = [
  {
    slug: "showroom",
    title: "The Showroom",
    icon: "🏛️",
    tagline: "For brands with products people should feel.",
    description:
      "An immersive product experience that turns browsing into atmosphere — tactile, specific, and built to make people feel something before they buy.",
    feels:
      "Like stepping into a beautifully curated space. You don't just see the product — you feel what it would be like to own it. The site does the emotional work that a static page never could.",
    forBrands:
      "Product brands, luxury goods, artisanal makers, fashion, home goods — anything where feel matters as much as function.",
  },
  {
    slug: "studio-world",
    title: "The Studio World",
    icon: "🌐",
    tagline: "For founders, creators, and personal brands.",
    description:
      "A website that feels like stepping inside your world — your process, your perspective, your voice. Built for people whose work carries a point of view.",
    feels:
      "Like being let into someone's studio. You understand immediately who made this, why, and what they believe. It doesn't perform professionalism — it demonstrates it by just being real.",
    forBrands:
      "Founders, designers, artists, consultants, personal brands, agencies — anyone whose work carries their perspective.",
  },
  {
    slug: "system-made-intuitive",
    title: "The System Made Intuitive",
    icon: "⚙️",
    tagline: "For businesses whose value is hidden behind complexity.",
    description:
      "A site that makes powerful, sophisticated products feel compelling and clear — so your audience understands what you do before you have to explain it.",
    feels:
      "Like complexity made legible. What used to require a sales call now just makes sense. The site does the explaining, and it does it without ever feeling like a manual.",
    forBrands:
      "B2B software, SaaS, professional services, logistics, fintech — businesses where the product is powerful but hard to communicate.",
  },
  {
    slug: "playground",
    title: "The Playground",
    icon: "🎮",
    tagline: "For brands brave enough to be remembered.",
    description:
      "An interactive experience that rewards curiosity, invites exploration, and gives people something to talk about — because the best marketing is a site people actually want to visit.",
    feels:
      "Like the internet used to feel. You click things not because you have to, but because you want to see what happens. Every interaction adds to the story instead of just confirming the sale.",
    forBrands:
      "Game studios, entertainment brands, creative agencies, experiential companies — anyone whose audience expects more than a brochure.",
  },
  {
    slug: "product-universe",
    title: "The Product Universe",
    icon: "🗺️",
    tagline: "For product companies with a world worth exploring.",
    description:
      "A website built around the experience of your product — not just its features. Depth becomes navigable. Complexity becomes adventure.",
    feels:
      "Like the product itself came to life on the screen. Instead of specs on a grid, you're navigating a world. Features become moments. Complexity becomes adventure.",
    forBrands:
      "Hardware, physical products, consumer tech, multi-product companies — anything with depth that deserves to be explored.",
  },
  {
    slug: "conversion-journey",
    title: "The Conversion Journey",
    icon: "🔄",
    tagline: "For brands that need to move people from interest to action.",
    description:
      "A site engineered to feel inevitable, not aggressive — where every section earns the next, and by the time there's an ask, it doesn't feel like selling.",
    feels:
      "Like the decision was already made before the CTA appeared. Every section earns the next. By the time there's an ask, it doesn't feel like selling — it feels like arriving.",
    forBrands:
      "High-ticket services, coaching, consulting, professional services — anything where trust must be built before a conversion is possible.",
  },
];
