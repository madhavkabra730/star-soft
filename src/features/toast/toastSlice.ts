import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

export type ToastState = ToastItem[];

const initialState: ToastState = [];

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: {
      reducer: (state, action: PayloadAction<ToastItem>) => {
        state.push(action.payload);
      },
      prepare: (message: string, variant: ToastVariant = "success") => ({
        payload: { id: nanoid(), message, variant },
      }),
    },
    removeToast: (state, action: PayloadAction<string>) => {
      return state.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;

export const selectToasts = (state: RootState) => state.toast;
