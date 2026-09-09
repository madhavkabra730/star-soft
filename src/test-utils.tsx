import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { makeStore, type AppStore } from "@/lib/store";

function AllProviders({ children, store }: { children: ReactNode; store: AppStore }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  const store = makeStore();
  return {
    store,
    ...render(ui, {
      wrapper: ({ children }) => <AllProviders store={store}>{children}</AllProviders>,
      ...options,
    }),
  };
}

export * from "@testing-library/react";
