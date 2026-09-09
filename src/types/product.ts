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
