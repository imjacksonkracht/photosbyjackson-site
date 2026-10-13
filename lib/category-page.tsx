import type { Metadata } from "next";
import { BookingCTA } from "@/components/BookingCTA";
import { WorkIndex } from "@/components/work/WorkIndex";
import { categories, type Category } from "@/content/projects";

const descriptions: Record<Category, string> = {
  music:
    "Concert and live music photography in Gainesville, FL: campus shows, festival stages, and arena tours by Jackson Kracht.",
  events:
    "Event photography in Gainesville, FL by Jackson Kracht: parades, campus organizations, and University of Florida events.",
  portraits: "Headshots and group portraits in Gainesville, FL by Jackson Kracht, for students and organizations at the University of Florida.",
};

export function categoryMetadata(c: Category): Metadata {
  return {
    title: categories[c].title,
    description: descriptions[c],
    alternates: { canonical: `/work/${c}` },
  };
}

export function CategoryPage({ category }: { category: Category }) {
  return (
    <>
      <WorkIndex initial={category} />
      <BookingCTA />
    </>
  );
}
