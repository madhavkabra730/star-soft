import { ProductGrid } from "@/components/ProductGrid/ProductGrid";
import { ProductsService, DEFAULT_PAGE_SIZE } from "@/lib/api";
import styles from "./page.module.scss";

export const revalidate = 60;

export default async function Home() {
  const initialData = await ProductsService.getProducts({ page: 1, limit: DEFAULT_PAGE_SIZE });

  return (
    <div className={styles.page}>
      <h1 className="visually-hidden">NFT Marketplace</h1>
      <ProductGrid initialData={initialData} />
    </div>
  );
}
