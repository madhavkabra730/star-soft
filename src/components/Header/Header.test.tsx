import { act, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { Header } from "./Header";
import { addToCart } from "@/features/cart/cartSlice";
import type { Product } from "@/types/product";

const product: Product = {
  id: 1,
  name: "Cosmic Ape #001",
  description: "A rare piece.",
  image: "/nfts/nft-01.svg",
  price: 1.5,
  createdAt: "2025-01-01T00:00:00.000Z",
  cryptoSymbol: "ETH",
  cryptoIconPath: "/icons/eth.svg",
};

describe("Header", () => {
  it("shows no cart badge when the cart is empty", () => {
    renderWithProviders(<Header />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("shows the item count badge once something is in the cart", () => {
    const { store } = renderWithProviders(<Header />);
    act(() => {
      store.dispatch(addToCart(product));
    });
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("exposes the item count in the cart button's accessible name", () => {
    const { store } = renderWithProviders(<Header />);
    act(() => {
      store.dispatch(addToCart(product));
    });
    expect(screen.getByRole("button", { name: /1 item/i })).toBeInTheDocument();
  });
});
