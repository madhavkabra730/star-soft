"use client";

import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/types/product";

interface UseProductOptions {
  initialData: Product;
}

async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch product (${res.status})`);
  return res.json() as Promise<Product>;
}

export function useProduct(id: number, { initialData }: UseProductOptions) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    initialData,
  });
}
