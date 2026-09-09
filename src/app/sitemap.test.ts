import sitemap from "./sitemap";
import { ProductsService } from "@/lib/api";
import type { Product } from "@/types/product";

jest.mock("@/lib/api", () => ({
  ProductsService: { getAllProducts: jest.fn() },
}));

const product = (id: number): Product => ({
  id,
  name: `NFT ${id}`,
  description: "desc",
  image: "https://example.com/nft.png",
  price: 1,
  createdAt: "2025-01-01T00:00:00.000Z",
});

describe("sitemap", () => {
  it("lists the homepage plus one entry per NFT", async () => {
    (ProductsService.getAllProducts as jest.Mock).mockResolvedValue([product(1), product(2)]);

    const result = await sitemap();

    expect(result[0]).toMatchObject({ url: "http://localhost:3000", priority: 1 });
    expect(result).toHaveLength(3);
    expect(result[1]).toMatchObject({ url: "http://localhost:3000/nft/1" });
    expect(result[2]).toMatchObject({ url: "http://localhost:3000/nft/2" });
  });
});
