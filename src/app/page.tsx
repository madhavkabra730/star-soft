import { ProductGrid } from "@/components/ProductGrid/ProductGrid";
import { ProductsService, DEFAULT_PAGE_SIZE } from "@/lib/api";
import styles from "./page.module.scss";

// ISR: the first page of NFTs is rendered at build/request time and revalidated
// every 60s — the App Router equivalent of `getStaticProps` + `revalidate`.
export const revalidate = 60;

export default async function Home() {
  const initialData = await ProductsService.getProducts({ page: 1, limit: DEFAULT_PAGE_SIZE });

  return (
    <div className={styles.page}>
      {/* Visually hidden: the Figma design goes straight from header to grid,
          but every page should still expose exactly one real heading. */}
      <h1 className="visually-hidden">NFT Marketplace</h1>
      <ProductGrid initialData={initialData} />
    </div>
  );
}
