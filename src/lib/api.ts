import type { PaginatedResponse, Product } from "@/types/product";

/** Base URL for the Starsoft/MKS challenge API (docs: api-challenge.starsoft.games/api-docs). */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api-challenge.starsoft.games/api/v1";

export const DEFAULT_PAGE_SIZE = 8;

/** The API rejects `rows` outside this range ("rows must be <= 50" / ">= 5"). */
const MAX_ROWS = 50;
const MIN_ROWS = 5;

export type SortableField = "id" | "name" | "price";
export type SortOrder = "ASC" | "DESC";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Raw shape actually returned by `GET /products` — `price` comes back as a decimal string. */
interface RawProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  createdAt: string;
}

interface RawProductsResponse {
  products: RawProduct[];
  count: number;
}

function normalizeProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    image: raw.image,
    price: Number(raw.price),
    createdAt: raw.createdAt,
  };
}

async function parseOrThrow<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }
  return (await response.json()) as T;
}

interface FetchPageParams {
  page: number;
  rows: number;
  sortBy?: SortableField;
  orderBy?: SortOrder;
}

async function fetchProductsPage({
  page,
  rows,
  sortBy = "id",
  orderBy = "ASC",
}: FetchPageParams): Promise<RawProductsResponse> {
  const clampedRows = Math.min(MAX_ROWS, Math.max(MIN_ROWS, rows));
  const params = new URLSearchParams({
    page: String(page),
    rows: String(clampedRows),
    sortBy,
    orderBy,
  });

  const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
    next: { revalidate: 60 },
  });
  return parseOrThrow<RawProductsResponse>(response);
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  sortBy?: SortableField;
  orderBy?: SortOrder;
}

export const ProductsService = {
  /** Paginated product list, normalized to `{ data, metadata }` for the grid and `useInfiniteQuery`. */
  async getProducts({
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
    sortBy,
    orderBy,
  }: GetProductsParams = {}): Promise<PaginatedResponse<Product>> {
    const raw = await fetchProductsPage({ page, rows: limit, sortBy, orderBy });
    return {
      data: raw.products.map(normalizeProduct),
      metadata: {
        page,
        limit,
        totalCount: raw.count,
        pageCount: Math.max(1, Math.ceil(raw.count / limit)),
      },
    };
  },

  /** There's no GET /products/:id, so this walks every page and returns the full catalogue. */
  async getAllProducts(): Promise<Product[]> {
    const first = await fetchProductsPage({ page: 1, rows: MAX_ROWS });
    const all = [...first.products];
    const pageCount = Math.ceil(first.count / MAX_ROWS);

    // Sequential by design: this is a small, build-time-only catalogue walk.
    for (let page = 2; page <= pageCount; page += 1) {
      const next = await fetchProductsPage({ page, rows: MAX_ROWS });
      all.push(...next.products);
    }

    return all.map(normalizeProduct);
  },

  /** Looks up a single NFT by id. Throws `ApiError(404)` if none matches. */
  async getProductById(id: number): Promise<Product> {
    const products = await this.getAllProducts();
    const product = products.find((item) => item.id === id);
    if (!product) {
      throw new ApiError(`Product ${id} not found`, 404);
    }
    return product;
  },
};
