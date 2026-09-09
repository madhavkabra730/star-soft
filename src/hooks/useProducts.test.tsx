import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useProducts } from "./useProducts";
import type { PaginatedResponse, Product } from "@/types/product";

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

function jsonOk(body: unknown): Response {
  return { ok: true, status: 200, json: async () => body } as Response;
}

describe("useProducts", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  it("starts in a loading state, then resolves the first page", async () => {
    fetchMock.mockResolvedValue(jsonOk(pageResponse(1, 2)));

    const { result } = renderHook(() => useProducts(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages[0].data[0].id).toBe(1);
    expect(result.current.hasNextPage).toBe(true);
  });

  it("fetches and appends the next page", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonOk(pageResponse(1, 2)))
      .mockResolvedValueOnce(jsonOk(pageResponse(2, 2)));

    const { result } = renderHook(() => useProducts(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(result.current.hasNextPage).toBe(false);
  });

  it("seeds from initialData with no loading flash", () => {
    fetchMock.mockResolvedValue(jsonOk(pageResponse(1, 1)));
    const initialData = pageResponse(1, 1);

    const { result } = renderHook(() => useProducts({ initialData }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data?.pages[0]).toEqual(initialData);
  });

  it("surfaces a fetch failure", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) } as Response);

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("calls /api/products with correct page and limit params", async () => {
    fetchMock.mockResolvedValue(jsonOk(pageResponse(1, 1)));

    const { result } = renderHook(() => useProducts({ limit: 8 }), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/products?page=1&limit=8"));
  });
});
