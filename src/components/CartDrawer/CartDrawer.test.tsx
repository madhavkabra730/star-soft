import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { CartDrawer } from "./CartDrawer";
import { addToCart, selectCartItems, selectCartTotal, selectCheckoutStatus } from "@/features/cart/cartSlice";
import type { Product } from "@/types/product";

const product: Product = {
  id: 1,
  name: "Cosmic Ape #001",
  description: "A rare piece.",
  image: "/nfts/nft-01.svg",
  price: 1.5,
  createdAt: "2025-01-01T00:00:00.000Z",
};

describe("CartDrawer", () => {
  it("shows an empty state when the cart has no items", () => {
    renderWithProviders(<CartDrawer isOpen onClose={jest.fn()} />);
    expect(screen.getByText("Seu carrinho está vazio.")).toBeInTheDocument();
  });

  it("closes when the Escape key is pressed", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderWithProviders(<CartDrawer isOpen onClose={onClose} />);

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not listen for Escape while closed", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderWithProviders(<CartDrawer isOpen={false} onClose={onClose} />);

    await user.keyboard("{Escape}");

    expect(onClose).not.toHaveBeenCalled();
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

  it("increments and decrements an item's quantity, updating the total", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<CartDrawer isOpen onClose={jest.fn()} />);
    act(() => {
      store.dispatch(addToCart(product));
    });

    const group = screen.getByRole("group", { name: /Quantidade de Cosmic Ape #001/i });
    const increment = within(group).getByRole("button", { name: /Aumentar quantidade/i });
    const decrement = within(group).getByRole("button", { name: /Diminuir quantidade/i });

    await user.click(increment);
    expect(selectCartItems(store.getState())[0].quantity).toBe(2);
    expect(selectCartTotal(store.getState())).toBeCloseTo(3);

    await user.click(decrement);
    expect(selectCartItems(store.getState())[0].quantity).toBe(1);
    expect(selectCartTotal(store.getState())).toBeCloseTo(1.5);
  });

  it("removes the item once its quantity is decremented below 1", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<CartDrawer isOpen onClose={jest.fn()} />);
    act(() => {
      store.dispatch(addToCart(product));
    });

    const group = screen.getByRole("group", { name: /Quantidade de Cosmic Ape #001/i });
    await user.click(within(group).getByRole("button", { name: /Diminuir quantidade/i }));

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
