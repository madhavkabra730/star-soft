import type { PaginatedResponse, Product } from "@/types/product";

/**
 * Base URL for the products API.
 *
 * The original Starsoft Challenge API (documented at
 * https://starsoft-challenge-7dfd4a56a575.herokuapp.com/v1/docs) has been
 * permanently taken down — the Heroku host returns "No such app". To keep
 * the app fully functional (and demonstrate the intended React Query /
 * SSR integration) this defaults to our own Next.js Route Handlers, which
 * serve local seed data in the exact same shape. Point
 * NEXT_PUBLIC_API_BASE_URL at a real backend to switch over with no other
 * code changes.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export const DEFAULT_PAGE_SIZE = 8;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseOrThrow<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }
  return (await response.json()) as T;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  /** Absolute base URL to prefix relative API paths — required for server-side fetches. */
  baseUrl?: string;
}

export const ProductsService = {
  async getProducts({ page = 1, limit = DEFAULT_PAGE_SIZE, baseUrl }: GetProductsParams = {}): Promise<
    PaginatedResponse<Product>
  > {
    const base = baseUrl ?? API_BASE_URL;
    const url = `${base}/products?page=${page}&limit=${limit}`;
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });
    return parseOrThrow<PaginatedResponse<Product>>(response);
  },

  async getProductById(id: number, baseUrl?: string): Promise<Product> {
    const base = baseUrl ?? API_BASE_URL;
    const response = await fetch(`${base}/products/${id}`, {
      next: { revalidate: 60 },
    });
    return parseOrThrow<Product>(response);
  },
};
