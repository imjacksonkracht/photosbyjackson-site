// Single source for business details. Anything shown in more than one place
// (header, footer, contact page, structured data) reads from here.

export const site = {
  name: "Photos by Jackson",
  photographer: "Jackson Kracht",
  url: "https://photosbyjackson.org",
  email: "jackson@photosbyjackson.org",
  location: "Gainesville & Winter Park, Florida",
  locationShort: "Gainesville & Winter Park, FL",
  university: "University of Florida",
  galleries: "https://galleries.photosbyjackson.org",
  instagram: { handle: "@wpgraphicz", url: "https://instagram.com/wpgraphicz" },
  personalSite: "https://jacksonkracht.com",
  description:
    "Concert, event, and portrait photography by Jackson Kracht in Gainesville and Winter Park, Florida.",
} as const;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Book" },
] as const;
