import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import NftDetailPage, { generateMetadata, generateStaticParams } from "./page";
import { ProductsService } from "@/lib/api";
import type { Product } from "@/types/product";

jest.mock("@/lib/api", () => ({
  ProductsService: { getProductById: jest.fn(), getAllProducts: jest.fn() },
}));

const product: Product = {
  id: 1,
  name: "Backpack",
  description: "Uma mochila resistente.",
  image: "https://example.com/backpack.png",
  price: 182,
  createdAt: "2024-07-18T23:55:43.238Z",
};

describe("generateStaticParams", () => {
  it("returns one param per NFT id", async () => {
    (ProductsService.getAllProducts as jest.Mock).mockResolvedValue([product, { ...product, id: 2 }]);

    expect(await generateStaticParams()).toEqual([{ id: "1" }, { id: "2" }]);
  });
});

describe("generateMetadata", () => {
  it("uses the product's name and description when it exists", async () => {
    (ProductsService.getProductById as jest.Mock).mockResolvedValue(product);

    const metadata = await generateMetadata({ params: Promise.resolve({ id: "1" }) });

    expect(metadata.title).toBe("Backpack");
    expect(metadata.description).toBe(product.description);
  });

  it("falls back to a not-found title when the NFT doesn't exist", async () => {
    (ProductsService.getProductById as jest.Mock).mockRejectedValue(new Error("404"));

    const metadata = await generateMetadata({ params: Promise.resolve({ id: "999" }) });

    expect(metadata.title).toBe("NFT não encontrado");
  });
});

describe("NftDetailPage", () => {
  it("renders the NFT's details and the buy section", async () => {
    (ProductsService.getProductById as jest.Mock).mockResolvedValue(product);

    const jsx = await NftDetailPage({ params: Promise.resolve({ id: "1" }) });
    renderWithProviders(jsx);

    expect(screen.getByRole("heading", { name: "Backpack" })).toBeInTheDocument();
    expect(screen.getByText("Uma mochila resistente.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Comprar" })).toBeInTheDocument();
  });

  it("calls notFound() when the NFT doesn't exist", async () => {
    (ProductsService.getProductById as jest.Mock).mockRejectedValue(new Error("404"));

    await expect(NftDetailPage({ params: Promise.resolve({ id: "999" }) })).rejects.toThrow();
  });
});
