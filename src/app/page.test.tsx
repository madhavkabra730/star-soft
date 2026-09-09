import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import Home from "./page";
import { ProductsService } from "@/lib/api";
import type { PaginatedResponse, Product } from "@/types/product";

jest.mock("@/lib/api", () => ({
  ProductsService: { getProducts: jest.fn() },
  DEFAULT_PAGE_SIZE: 8,
}));

const initialData: PaginatedResponse<Product> = {
  data: [{ id: 1, name: "Backpack", description: "d", image: "i.png", price: 1, createdAt: "2025-01-01" }],
  metadata: { page: 1, pageCount: 1, totalCount: 1, limit: 8 },
};

describe("Home", () => {
  it("renders the NFT catalogue seeded from the server-rendered first page", async () => {
    (ProductsService.getProducts as jest.Mock).mockResolvedValue(initialData);

    const jsx = await Home();
    renderWithProviders(jsx);

    expect(screen.getByRole("heading", { name: "NFT Marketplace" })).toBeInTheDocument();
    expect(screen.getByText("Backpack")).toBeInTheDocument();
  });
});
