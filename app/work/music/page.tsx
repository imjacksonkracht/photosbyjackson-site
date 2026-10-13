import { CategoryPage, categoryMetadata } from "@/lib/category-page";

export const metadata = categoryMetadata("music");

export default function Page() {
  return <CategoryPage category="music" />;
}
