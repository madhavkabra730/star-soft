import { MOCK_PRODUCTS } from "@/mocks/products";
import { DEFAULT_PAGE_SIZE } from "@/lib/api";
import type { PaginatedResponse, Product } from "@/types/product";

/**
 * Direct, in-process data access for the seed catalogue.
 *
 * Server Components (the home page, the NFT detail page, `generateStaticParams`)
 * call these functions directly instead of `fetch`-ing our own `/api/products`
 * route — self-fetching your own API from a Server Component is an
 * antipattern (it needs an absolute URL and adds a pointless network hop in
 * production). The Route Handlers in `src/app/api` call the same functions,
 * so the HTTP contract used by client-side React Query stays identical.
 */
export function getProductsPage(page = 1, limit = DEFAULT_PAGE_SIZE): PaginatedResponse<Product> {
  const totalCount = MOCK_PRODUCTS.length;
  const pageCount = Math.ceil(totalCount / limit);
  const start = (page - 1) * limit;
  const data = MOCK_PRODUCTS.slice(start, start + limit);

  return {
    data,
    metadata: { page, pageCount, totalCount, limit },
  };
}

export function getProductById(id: number): Product | undefined {
  return MOCK_PRODUCTS.find((product) => product.id === id);
}

export function getAllProductIds(): number[] {
  return MOCK_PRODUCTS.map((product) => product.id);
}
