"use client";

import { useCallback } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { addToast, type ToastVariant } from "@/features/toast/toastSlice";

export function useToast() {
  const dispatch = useAppDispatch();

  return useCallback(
    (message: string, variant: ToastVariant = "success") => {
      dispatch(addToast(message, variant));
    },
    [dispatch],
  );
}
