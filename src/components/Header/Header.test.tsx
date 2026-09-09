import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
};

describe("Header", () => {
  it("shows a zero cart count when the cart is empty", () => {
    renderWithProviders(<Header />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("shows the item count once something is in the cart", () => {
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

  it("opens the cart drawer when the cart button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    await user.click(screen.getByRole("button", { name: /Abrir carrinho/i }));

    expect(await screen.findByRole("dialog", { name: "Carrinho de compras" })).toBeInTheDocument();
  });
});
