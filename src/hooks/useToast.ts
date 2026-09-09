"use client";

import { useCallback } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { addToast, type ToastVariant } from "@/features/toast/toastSlice";

/** Dispatches a toast notification, shown by the global ToastViewport. */
export function useToast() {
  const dispatch = useAppDispatch();

  return useCallback(
    (message: string, variant: ToastVariant = "success") => {
      dispatch(addToast(message, variant));
    },
    [dispatch],
  );
}
