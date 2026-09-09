"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/lib/api";
import type { Product } from "@/types/product";

interface UseProductOptions {
  /** Required and non-undefined so React Query's `data` is typed as `Product`, never `Product | undefined`. */
  initialData: Product;
}

/** Fetches a single NFT by id, seeded from the server-rendered page so there's no loading state to handle. */
export function useProduct(id: number, { initialData }: UseProductOptions) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductsService.getProductById(id),
    initialData,
  });
}
