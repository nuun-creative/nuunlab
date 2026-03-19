/**
 * JSON-LD structured data helpers.
 * Inject via <script type="application/ld+json"> in layout or page.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nuuncreative.com";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NUUN Creative",
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "801-550-0241",
      email: "contact@nuun.dev",
      contactType: "customer service",
    },
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NUUN Creative Lab",
    url: BASE_URL,
    description:
      "A digital design and development studio. We make things worth finding.",
  };
}
