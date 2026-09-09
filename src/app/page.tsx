import { ProductGrid } from "@/components/ProductGrid/ProductGrid";
import { getProductsPage } from "@/lib/products";
import { DEFAULT_PAGE_SIZE } from "@/lib/api";
import styles from "./page.module.scss";

// ISR: the first page of NFTs is rendered at build/request time and revalidated
// every 60s — the App Router equivalent of `getStaticProps` + `revalidate`.
export const revalidate = 60;

export default function Home() {
  const initialData = getProductsPage(1, DEFAULT_PAGE_SIZE);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Descubra NFTs únicos</h1>
        <p className={styles.subtitle}>
          Colecione arte digital verificada on-chain e acompanhe seu carrinho em tempo real.
        </p>
      </section>

      <ProductGrid initialData={initialData} />
    </div>
  );
}
