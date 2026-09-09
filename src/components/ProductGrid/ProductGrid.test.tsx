import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";
import { ProductGrid } from "./ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import type { PaginatedResponse, Product } from "@/types/product";

jest.mock("@/hooks/useProducts");

const mockedUseProducts = useProducts as jest.Mock;

function product(id: number): Product {
  return {
    id,
    name: `NFT ${id}`,
    description: "desc",
    image: "https://example.com/nft.png",
    price: 1,
    createdAt: "2025-01-01",
  };
}

const initialData: PaginatedResponse<Product> = {
  data: [product(1)],
  metadata: { page: 1, pageCount: 1, totalCount: 1, limit: 8 },
};

describe("ProductGrid", () => {
  it("shows a skeleton grid while the first page loads", () => {
    mockedUseProducts.mockReturnValue({ isLoading: true, isError: false, data: undefined });

    const { container } = renderWithProviders(<ProductGrid initialData={initialData} />);

    expect(container.querySelectorAll("[aria-hidden]").length).toBe(8);
  });

  it("shows a retry affordance when the fetch fails", async () => {
    const refetch = jest.fn();
    mockedUseProducts.mockReturnValue({ isError: true, error: new Error("network down"), refetch });
    const user = userEvent.setup();

    renderWithProviders(<ProductGrid initialData={initialData} />);
    expect(screen.getByRole("alert")).toHaveTextContent("network down");

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("shows an empty state when there are no products", () => {
    mockedUseProducts.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { pages: [{ data: [], metadata: { page: 1, pageCount: 1, totalCount: 0, limit: 8 } }] },
    });

    renderWithProviders(<ProductGrid initialData={initialData} />);
    expect(screen.getByText("Nenhum NFT disponível no momento.")).toBeInTheDocument();
  });

  it("renders the catalogue and lets the user load more pages", async () => {
    const fetchNextPage = jest.fn();
    mockedUseProducts.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        pages: [
          { data: [product(1), product(2)], metadata: { page: 1, pageCount: 2, totalCount: 16, limit: 8 } },
        ],
      },
      fetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    });
    const user = userEvent.setup();

    renderWithProviders(<ProductGrid initialData={initialData} />);
    expect(screen.getByText("NFT 1")).toBeInTheDocument();
    expect(screen.getByText("NFT 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Carregar mais" }));
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("disables load-more once every page has been fetched", () => {
    mockedUseProducts.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { pages: [{ data: [product(1)], metadata: { page: 1, pageCount: 1, totalCount: 1, limit: 8 } }] },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    renderWithProviders(<ProductGrid initialData={initialData} />);
    expect(screen.getByRole("button", { name: "Você já viu tudo" })).toBeDisabled();
  });
});
