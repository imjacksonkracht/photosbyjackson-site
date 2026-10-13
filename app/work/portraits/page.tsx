import { CategoryPage, categoryMetadata } from "@/lib/category-page";

export const metadata = categoryMetadata("portraits");

export default function Page() {
  return <CategoryPage category="portraits" />;
}
