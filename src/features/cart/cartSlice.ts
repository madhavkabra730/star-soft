import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/product";
import type { RootState } from "@/lib/store";

export type CheckoutStatus = "idle" | "completed";

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  status: CheckoutStatus;
  hydrated: boolean;
}

const initialState: CartState = {
  items: [],
  status: "idle",
  hydrated: false,
};

function toCartItem(product: Product): CartItem {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    quantity: 1,
  };
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const alreadyInCart = state.items.some((item) => item.id === action.payload.id);
      if (!alreadyInCart) {
        state.items.push(toCartItem(action.payload));
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (!item) return;
      if (item.quantity <= 1) {
        state.items = state.items.filter((entry) => entry.id !== action.payload);
      } else {
        item.quantity -= 1;
      }
    },
    checkout: (state) => {
      if (state.items.length > 0) {
        state.status = "completed";
      }
    },
    resetCart: (state) => {
      state.items = [];
      state.status = "idle";
    },
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.hydrated = true;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  checkout,
  resetCart,
  hydrateCart,
} = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartHydrated = (state: RootState) => state.cart.hydrated;
export const selectCheckoutStatus = (state: RootState) => state.cart.status;
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectIsInCart = (id: number) => (state: RootState) =>
  state.cart.items.some((item) => item.id === id);
