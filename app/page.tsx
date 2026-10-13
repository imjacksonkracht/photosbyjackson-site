import type { Metadata } from "next";
import { BookingCTA } from "@/components/BookingCTA";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { CategoryNav } from "@/components/home/CategoryNav";
import { Hero } from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork";
import { JsonLd, personLd, websiteLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd data={personLd} />
      <JsonLd data={websiteLd} />
      <Hero />
      <SelectedWork />
      <CategoryNav />
      <AboutTeaser />
      <BookingCTA />
    </>
  );
}
