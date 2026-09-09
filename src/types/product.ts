/**
 * Domain types for the NFT marketplace.
 *
 * Shaped to mirror the (now offline) Starsoft Challenge API contract
 * (`GET /v1/products?page&limit` -> `{ data, metadata }`), so swapping the
 * mock service in `src/lib/api.ts` for a real fetch call is a drop-in change.
 */

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  createdAt: string;
  cryptoSymbol: string;
  cryptoIconPath: string;
}

export interface PaginationMetadata {
  page: number;
  pageCount: number;
  totalCount: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: PaginationMetadata;
}
