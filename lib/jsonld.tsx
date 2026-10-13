import { site } from "@/content/site";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD built from static, trusted content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.photographer,
  jobTitle: "Photographer",
  url: site.url,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Gainesville", addressRegion: "FL", addressCountry: "US" },
  affiliation: { "@type": "CollegeOrUniversity", name: site.university },
  knowsAbout: ["Concert photography", "Event photography", "Portrait photography", "Headshot photography"],
  sameAs: [site.instagram.url, site.personalSite],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  author: { "@type": "Person", name: site.photographer },
};
