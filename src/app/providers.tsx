"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { makeStore } from "@/lib/store";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { hydrateCart, selectCartHydrated, selectCartItems, type CartItem } from "@/features/cart/cartSlice";

const CART_STORAGE_KEY = "starsoft-nft-cart";

/** Restores the cart from localStorage on mount and persists it on every change after. */
function CartPersistenceGate({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const hydrated = useAppSelector(selectCartHydrated);

  useEffect(() => {
    let restored: CartItem[] = [];
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      restored = raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      restored = [];
    }
    dispatch(hydrateCart(restored));
    // Runs once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage may be unavailable (private mode, quota) — cart still works in-memory.
    }
  }, [items, hydrated]);

  return children;
}

export function Providers({ children }: { children: ReactNode }) {
  const [store] = useState(() => makeStore());

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <CartPersistenceGate>{children}</CartPersistenceGate>
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </Provider>
  );
}
