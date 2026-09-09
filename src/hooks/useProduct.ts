"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/lib/api";
import type { Product } from "@/types/product";

interface UseProductOptions {
  initialData: Product;
}

export function useProduct(id: number, { initialData }: UseProductOptions) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductsService.getProductById(id),
    initialData,
  });
}
