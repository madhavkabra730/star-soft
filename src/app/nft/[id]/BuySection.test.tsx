import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { BuySection } from "./BuySection";
import { selectCartItems } from "@/features/cart/cartSlice";
import { ProductsService } from "@/lib/api";
import type { Product } from "@/types/product";

jest.mock("@/lib/api", () => ({
  ProductsService: { getProductById: jest.fn() },
}));

const product: Product = {
  id: 1,
  name: "Backpack",
  description: "Uma mochila resistente.",
  image: "https://example.com/backpack.png",
  price: 182,
  createdAt: "2024-07-18T23:55:43.238Z",
};

describe("BuySection", () => {
  beforeEach(() => {
    (ProductsService.getProductById as jest.Mock).mockResolvedValue(product);
  });

  it("shows the price and adds the NFT to the cart on buy", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<BuySection product={product} />);

    expect(screen.getByText(/182\.000/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Comprar" }));

    expect(selectCartItems(store.getState())).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Adicionado ao carrinho" })).toBeDisabled();
  });
});
