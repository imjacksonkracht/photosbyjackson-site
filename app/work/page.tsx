import type { Metadata } from "next";
import { BookingCTA } from "@/components/BookingCTA";
import { WorkIndex } from "@/components/work/WorkIndex";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Concert, event, and portrait photography by Jackson Kracht, a Gainesville photographer at the University of Florida.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <WorkIndex initial="all" />
      <BookingCTA />
    </>
  );
}
