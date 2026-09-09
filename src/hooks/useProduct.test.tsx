import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useProduct } from "./useProduct";
import type { Product } from "@/types/product";

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

const product: Product = {
  id: 1,
  name: "Backpack",
  description: "Uma mochila resistente.",
  image: "https://example.com/backpack.png",
  price: 182,
  createdAt: "2024-07-18T23:55:43.238Z",
};

describe("useProduct", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  it("seeds data from initialData with no loading state", () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => product } as Response);

    const { result } = renderHook(() => useProduct(1, { initialData: product }), { wrapper });

    expect(result.current.data).toEqual(product);
    expect(result.current.isLoading).toBe(false);
  });

  it("looks the product up via /api/products/:id in the background", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => product } as Response);

    renderHook(() => useProduct(1, { initialData: product }), { wrapper });

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/products/1")),
    );
  });
});
