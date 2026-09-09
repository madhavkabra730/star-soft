import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { ProductCard } from "./ProductCard";
import { selectCartItems } from "@/features/cart/cartSlice";
import type { Product } from "@/types/product";

const product: Product = {
  id: 1,
  name: "Cosmic Ape #001",
  description: "A rare piece from a generative collection.",
  image: "/nfts/nft-01.svg",
  price: 1.5,
  createdAt: "2025-01-01T00:00:00.000Z",
  cryptoSymbol: "ETH",
  cryptoIconPath: "/icons/eth.svg",
};

describe("ProductCard", () => {
  it("renders the NFT's name, description and price", () => {
    renderWithProviders(<ProductCard product={product} />);

    expect(screen.getByText("Cosmic Ape #001")).toBeInTheDocument();
    expect(screen.getByText("A rare piece from a generative collection.")).toBeInTheDocument();
    expect(screen.getByText(/1\.500/)).toBeInTheDocument();
  });

  it('adds the product to the cart and flips the button to "Adicionado ao carrinho"', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<ProductCard product={product} />);

    const buyButton = screen.getByRole("button", { name: "Comprar" });
    await user.click(buyButton);

    expect(selectCartItems(store.getState())).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Adicionado ao carrinho" })).toBeDisabled();
  });
});
