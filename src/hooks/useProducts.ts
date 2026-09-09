"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ProductsService, DEFAULT_PAGE_SIZE } from "@/lib/api";
import type { PaginatedResponse, Product } from "@/types/product";

interface UseProductsOptions {
  initialData?: PaginatedResponse<Product>;
  limit?: number;
}

/**
 * Infinite-scroll-style pagination for the NFT grid, driving the
 * "Carregar mais" / "Você já viu tudo" load-more button.
 *
 * Seeded with `initialData` from the server-rendered first page so there's
 * no loading flash for the content that was already sent as HTML.
 */
export function useProducts({ initialData, limit = DEFAULT_PAGE_SIZE }: UseProductsOptions = {}) {
  return useInfiniteQuery({
    queryKey: ["products", { limit }],
    queryFn: ({ pageParam }) => ProductsService.getProducts({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metadata.page < lastPage.metadata.pageCount ? lastPage.metadata.page + 1 : undefined,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [1],
        }
      : undefined,
  });
}
