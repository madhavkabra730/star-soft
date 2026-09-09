"use client";

import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCard/ProductCardSkeleton";
import { LoadMoreButton } from "@/components/LoadMoreButton/LoadMoreButton";
import { Button } from "@/components/Button/Button";
import type { PaginatedResponse, Product } from "@/types/product";
import styles from "./ProductGrid.module.scss";

interface ProductGridProps {
  initialData: PaginatedResponse<Product>;
}

const SKELETON_COUNT = 8;

export function ProductGrid({ initialData }: ProductGridProps) {
  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProducts({ initialData, limit: initialData.metadata.limit });

  if (isError) {
    return (
      <div className={styles.state} role="alert">
        <p>Não foi possível carregar os NFTs. {error instanceof Error ? error.message : ""}</p>
        <Button variant="secondary" onClick={() => refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const products = data.pages.flatMap((page) => page.data);

  if (products.length === 0) {
    return (
      <div className={styles.state}>
        <p>Nenhum NFT disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>

      <div className={styles.loadMoreWrapper}>
        <LoadMoreButton
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
          hasMore={Boolean(hasNextPage)}
        />
      </div>
    </div>
  );
}
