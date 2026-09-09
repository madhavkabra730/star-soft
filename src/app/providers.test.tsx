import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Providers } from "./providers";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart, selectCartItems } from "@/features/cart/cartSlice";
import type { Product } from "@/types/product";

const CART_STORAGE_KEY = "starsoft-nft-cart";

const product: Product = {
  id: 1,
  name: "Backpack",
  description: "d",
  image: "i.png",
  price: 1,
  createdAt: "2025-01-01T00:00:00.000Z",
};

/** Reads/writes cart state through the same Redux context Providers sets up, to exercise the localStorage gate. */
function CartProbe() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  return (
    <div>
      <span>items: {items.length}</span>
      <button onClick={() => dispatch(addToCart(product))}>add</button>
    </div>
  );
}

describe("Providers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders its children", () => {
    render(
      <Providers>
        <p>hello</p>
      </Providers>,
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("hydrates the cart from localStorage on mount", async () => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([{ ...product, quantity: 2 }]));

    render(
      <Providers>
        <CartProbe />
      </Providers>,
    );

    expect(await screen.findByText("items: 1")).toBeInTheDocument();
  });

  it("persists cart changes to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <Providers>
        <CartProbe />
      </Providers>,
    );

    await screen.findByText("items: 0");
    await user.click(screen.getByRole("button", { name: "add" }));

    expect(await screen.findByText("items: 1")).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]")).toHaveLength(1);
  });

  it("falls back to an empty cart when localStorage holds invalid JSON", async () => {
    window.localStorage.setItem(CART_STORAGE_KEY, "not json");

    render(
      <Providers>
        <CartProbe />
      </Providers>,
    );

    expect(await screen.findByText("items: 0")).toBeInTheDocument();
  });
});
