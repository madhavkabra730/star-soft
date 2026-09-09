import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { CartDrawer } from "./CartDrawer";
import { addToCart, selectCartItems, selectCheckoutStatus } from "@/features/cart/cartSlice";
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

describe("CartDrawer", () => {
  it("shows an empty state when the cart has no items", () => {
    renderWithProviders(<CartDrawer isOpen onClose={jest.fn()} />);
    expect(screen.getByText("Seu carrinho está vazio.")).toBeInTheDocument();
  });

  it("lists items and enables the checkout button once something is in the cart", () => {
    const { store } = renderWithProviders(<CartDrawer isOpen onClose={jest.fn()} />);
    act(() => {
      store.dispatch(addToCart(product));
    });

    expect(screen.getByText("Cosmic Ape #001")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Finalizar compra" })).toBeEnabled();
  });

  it("removes an item when its remove button is clicked", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<CartDrawer isOpen onClose={jest.fn()} />);
    act(() => {
      store.dispatch(addToCart(product));
    });

    await user.click(screen.getByRole("button", { name: /Remover Cosmic Ape #001/i }));

    expect(selectCartItems(store.getState())).toHaveLength(0);
  });

  it("completes checkout, then clears the cart and closes the drawer", async () => {
    jest.useFakeTimers({ legacyFakeTimers: false });
    const user = userEvent.setup({ delay: null });
    const onClose = jest.fn();
    const { store } = renderWithProviders(<CartDrawer isOpen onClose={onClose} />);

    act(() => {
      store.dispatch(addToCart(product));
    });

    await user.click(screen.getByRole("button", { name: "Finalizar compra" }));

    expect(selectCheckoutStatus(store.getState())).toBe("completed");
    expect(screen.getByRole("button", { name: "Compra finalizada!" })).toBeDisabled();

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(selectCartItems(store.getState())).toHaveLength(0);
    expect(selectCheckoutStatus(store.getState())).toBe("idle");
    expect(onClose).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
