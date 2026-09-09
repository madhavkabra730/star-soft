import cartReducer, {
  addToCart,
  checkout,
  decrementQuantity,
  hydrateCart,
  incrementQuantity,
  removeFromCart,
  resetCart,
  selectCartCount,
  selectCartTotal,
  selectIsInCart,
  type CartItem,
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
};

const cartItem: CartItem = {
  id: 1,
  name: "Cosmic Ape #001",
  description: "A rare piece.",
  price: 1.5,
  image: "/nfts/nft-01.svg",
  quantity: 1,
};

const otherCartItem: CartItem = { ...cartItem, id: 2, name: "Neon Dreamscape", price: 0.8 };

function makeState(overrides: Partial<CartState> = {}): CartState {
  return { items: [], status: "idle", hydrated: false, ...overrides };
}

describe("cartSlice", () => {
  it("adds a product to an empty cart at quantity 1", () => {
    const state = cartReducer(makeState(), addToCart(product));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ id: 1, name: "Cosmic Ape #001", price: 1.5, quantity: 1 });
  });

  it("does not add a second entry for a product already in the cart", () => {
    const withOne = cartReducer(makeState(), addToCart(product));
    const withTwo = cartReducer(withOne, addToCart(product));
    expect(withTwo.items).toHaveLength(1);
    expect(withTwo.items[0].quantity).toBe(1);
  });

  it("removes a product by id", () => {
    const withItems = cartReducer(makeState({ items: [cartItem, otherCartItem] }), removeFromCart(1));
    expect(withItems.items).toHaveLength(1);
    expect(withItems.items[0].id).toBe(2);
  });

  describe("quantity stepper", () => {
    it("increments an item's quantity", () => {
      const state = cartReducer(makeState({ items: [{ ...cartItem }] }), incrementQuantity(1));
      expect(state.items[0].quantity).toBe(2);
    });

    it("decrements an item's quantity", () => {
      const state = cartReducer(makeState({ items: [{ ...cartItem, quantity: 2 }] }), decrementQuantity(1));
      expect(state.items[0].quantity).toBe(1);
    });

    it("removes the item once quantity would drop below 1", () => {
      const state = cartReducer(makeState({ items: [{ ...cartItem, quantity: 1 }] }), decrementQuantity(1));
      expect(state.items).toHaveLength(0);
    });

    it("is a no-op for an id that isn't in the cart", () => {
      const before = makeState({ items: [{ ...cartItem }] });
      const state = cartReducer(before, incrementQuantity(999));
      expect(state.items).toEqual(before.items);
    });

    it("decrementQuantity is a no-op for an id that isn't in the cart", () => {
      const before = makeState({ items: [{ ...cartItem }] });
      const state = cartReducer(before, decrementQuantity(999));
      expect(state.items).toEqual(before.items);
    });
  });

  it("checkout marks status as completed only when the cart has items", () => {
    const emptyResult = cartReducer(makeState(), checkout());
    expect(emptyResult.status).toBe("idle");

    const filledResult = cartReducer(makeState({ items: [cartItem] }), checkout());
    expect(filledResult.status).toBe("completed");
  });

  it("resetCart clears items and returns to idle", () => {
    const state = cartReducer(makeState({ items: [cartItem], status: "completed" }), resetCart());
    expect(state.items).toHaveLength(0);
    expect(state.status).toBe("idle");
  });

  it("hydrateCart restores items and marks the cart as hydrated", () => {
    const state = cartReducer(makeState(), hydrateCart([cartItem]));
    expect(state.hydrated).toBe(true);
    expect(state.items).toHaveLength(1);
  });

  describe("selectors", () => {
    const rootState = {
      cart: makeState({ items: [{ ...cartItem, quantity: 2 }, otherCartItem] }),
    } as RootState;

    it("selectCartCount sums quantities, not just line items", () => {
      expect(selectCartCount(rootState)).toBe(3);
    });

    it("selectCartTotal sums price * quantity across items", () => {
      expect(selectCartTotal(rootState)).toBeCloseTo(1.5 * 2 + 0.8);
    });

    it("selectIsInCart reports membership by id", () => {
      expect(selectIsInCart(1)(rootState)).toBe(true);
      expect(selectIsInCart(999)(rootState)).toBe(false);
    });
  });
});
