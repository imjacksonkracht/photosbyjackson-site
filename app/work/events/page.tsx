import { CategoryPage, categoryMetadata } from "@/lib/category-page";

export const metadata = categoryMetadata("events");

export default function Page() {
  return <CategoryPage category="events" />;
}
