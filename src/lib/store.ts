import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/features/cart/cartSlice";
import toastReducer from "@/features/toast/toastSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      cart: cartReducer,
      toast: toastReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
