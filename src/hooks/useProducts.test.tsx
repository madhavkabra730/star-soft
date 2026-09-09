import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useProducts } from "./useProducts";
import { ProductsService } from "@/lib/api";
import type { PaginatedResponse, Product } from "@/types/product";

jest.mock("@/lib/api", () => ({
  ProductsService: { getProducts: jest.fn() },
  DEFAULT_PAGE_SIZE: 8,
}));

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function pageResponse(page: number, pageCount: number): PaginatedResponse<Product> {
  return {
    data: [
      { id: page, name: `NFT ${page}`, description: "d", image: "i.png", price: 1, createdAt: "2025-01-01" },
    ],
    metadata: { page, pageCount, totalCount: pageCount * 8, limit: 8 },
  };
}

describe("useProducts", () => {
  it("starts in a loading state, then resolves the first page", async () => {
    (ProductsService.getProducts as jest.Mock).mockResolvedValue(pageResponse(1, 2));

    const { result } = renderHook(() => useProducts(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages[0].data[0].id).toBe(1);
    expect(result.current.hasNextPage).toBe(true);
  });

  it("fetches and appends the next page", async () => {
    (ProductsService.getProducts as jest.Mock)
      .mockResolvedValueOnce(pageResponse(1, 2))
      .mockResolvedValueOnce(pageResponse(2, 2));

    const { result } = renderHook(() => useProducts(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(result.current.hasNextPage).toBe(false);
  });

  it("seeds from initialData with no loading flash", () => {
    (ProductsService.getProducts as jest.Mock).mockResolvedValue(pageResponse(1, 1));
    const initialData = pageResponse(1, 1);

    const { result } = renderHook(() => useProducts({ initialData }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data?.pages[0]).toEqual(initialData);
  });

  it("surfaces a fetch failure", async () => {
    (ProductsService.getProducts as jest.Mock).mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
