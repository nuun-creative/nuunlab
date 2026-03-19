import type { Metadata } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nuuncreative.com";

const DEFAULTS = {
  title: "NUUN Creative Lab — We make things worth finding.",
  description:
    "A digital design and development studio. We build web experiences that feel alive — specific, crafted, and made to be remembered.",
  image: "/images/og-default.png",
  siteName: "NUUN Creative",
};

/**
 * Build consistent page metadata from simple overrides.
 *
 * Usage in any page.tsx:
 *   export const metadata = buildMetadata({ title: "The Manifesto", path: "/manifesto" });
 */
export function buildMetadata(overrides: {
  title?: string;
  description?: string;
  /** Path relative to base URL, e.g. "/manifesto" */
  path?: string;
  image?: string;
}): Metadata {
  const title = overrides.title
    ? `${overrides.title} — NUUN Creative`
    : DEFAULTS.title;
  const description = overrides.description ?? DEFAULTS.description;
  const url = `${BASE_URL}${overrides.path ?? ""}`;
  const image = overrides.image ?? DEFAULTS.image;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: DEFAULTS.siteName,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export { BASE_URL };
