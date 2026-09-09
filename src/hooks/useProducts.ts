"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE } from "@/lib/api";
import type { PaginatedResponse, Product } from "@/types/product";

interface UseProductsOptions {
  initialData?: PaginatedResponse<Product>;
  limit?: number;
}

async function fetchProductsPage(page: number, limit: number): Promise<PaginatedResponse<Product>> {
  const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
  return res.json() as Promise<PaginatedResponse<Product>>;
}

export function useProducts({ initialData, limit = DEFAULT_PAGE_SIZE }: UseProductsOptions = {}) {
  return useInfiniteQuery({
    queryKey: ["products", { limit }],
    queryFn: ({ pageParam }) => fetchProductsPage(pageParam, limit),
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
