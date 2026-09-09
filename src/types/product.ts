/** Normalized product shape used across the app — see src/lib/api.ts for how it's derived from the raw API response. */
export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  createdAt: string;
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
