import cartReducer, {
  addToCart,
  checkout,
  hydrateCart,
  removeFromCart,
  resetCart,
  selectCartCount,
  selectCartTotal,
  selectIsInCart,
  type CartState,
} from "./cartSlice";
import type { Product } from "@/types/product";
import type { RootState } from "@/lib/store";

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

const otherProduct: Product = { ...product, id: 2, name: "Neon Dreamscape", price: 0.8 };

function makeState(overrides: Partial<CartState> = {}): CartState {
  return { items: [], status: "idle", hydrated: false, ...overrides };
}

describe("cartSlice", () => {
  it("adds a product to an empty cart", () => {
    const state = cartReducer(makeState(), addToCart(product));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ id: 1, name: "Cosmic Ape #001", price: 1.5 });
  });

  it("does not add the same product twice (NFTs are unique)", () => {
    const withOne = cartReducer(makeState(), addToCart(product));
    const withTwo = cartReducer(withOne, addToCart(product));
    expect(withTwo.items).toHaveLength(1);
  });

  it("removes a product by id", () => {
    const withItems = cartReducer(
      makeState({ items: [{ ...product }, { ...otherProduct }] }),
      removeFromCart(1),
    );
    expect(withItems.items).toHaveLength(1);
    expect(withItems.items[0].id).toBe(2);
  });

  it("checkout marks status as completed only when the cart has items", () => {
    const emptyResult = cartReducer(makeState(), checkout());
    expect(emptyResult.status).toBe("idle");

    const filledResult = cartReducer(makeState({ items: [{ ...product }] }), checkout());
    expect(filledResult.status).toBe("completed");
  });

  it("resetCart clears items and returns to idle", () => {
    const state = cartReducer(makeState({ items: [{ ...product }], status: "completed" }), resetCart());
    expect(state.items).toHaveLength(0);
    expect(state.status).toBe("idle");
  });

  it("hydrateCart restores items and marks the cart as hydrated", () => {
    const state = cartReducer(makeState(), hydrateCart([{ ...product }]));
    expect(state.hydrated).toBe(true);
    expect(state.items).toHaveLength(1);
  });

  describe("selectors", () => {
    const rootState = { cart: makeState({ items: [{ ...product }, { ...otherProduct }] }) } as RootState;

    it("selectCartCount returns the number of items", () => {
      expect(selectCartCount(rootState)).toBe(2);
    });

    it("selectCartTotal sums item prices", () => {
      expect(selectCartTotal(rootState)).toBeCloseTo(2.3);
    });

    it("selectIsInCart reports membership by id", () => {
      expect(selectIsInCart(1)(rootState)).toBe(true);
      expect(selectIsInCart(999)(rootState)).toBe(false);
    });
  });
});
