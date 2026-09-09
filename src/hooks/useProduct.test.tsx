import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useProduct } from "./useProduct";
import { ProductsService } from "@/lib/api";
import type { Product } from "@/types/product";

jest.mock("@/lib/api", () => ({
  ProductsService: { getProductById: jest.fn() },
}));

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
  it("seeds data from initialData with no loading state", () => {
    (ProductsService.getProductById as jest.Mock).mockResolvedValue(product);

    const { result } = renderHook(() => useProduct(1, { initialData: product }), { wrapper });

    expect(result.current.data).toEqual(product);
    expect(result.current.isLoading).toBe(false);
  });

  it("looks the product up by id in the background", async () => {
    (ProductsService.getProductById as jest.Mock).mockResolvedValue(product);

    renderHook(() => useProduct(1, { initialData: product }), { wrapper });

    await waitFor(() => expect(ProductsService.getProductById).toHaveBeenCalledWith(1));
  });
});
