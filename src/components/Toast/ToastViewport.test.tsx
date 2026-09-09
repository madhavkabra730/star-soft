import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { ToastViewport } from "./ToastViewport";
import { addToast, selectToasts } from "@/features/toast/toastSlice";

describe("ToastViewport", () => {
  it("renders nothing when there are no toasts", () => {
    renderWithProviders(<ToastViewport />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows a dispatched toast", () => {
    const { store } = renderWithProviders(<ToastViewport />);

    act(() => {
      store.dispatch(addToast("Backpack adicionado ao carrinho"));
    });

    expect(screen.getByText("Backpack adicionado ao carrinho")).toBeInTheDocument();
  });

  it("dismisses a toast when its close button is clicked", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<ToastViewport />);

    act(() => {
      store.dispatch(addToast("Backpack adicionado ao carrinho"));
    });

    await user.click(screen.getByRole("button", { name: "Fechar notificação" }));

    expect(selectToasts(store.getState())).toHaveLength(0);
  });

  it("auto-dismisses a toast after its duration elapses", () => {
    jest.useFakeTimers({ legacyFakeTimers: false });
    const { store } = renderWithProviders(<ToastViewport />);

    act(() => {
      store.dispatch(addToast("Backpack adicionado ao carrinho"));
    });
    expect(screen.getByText("Backpack adicionado ao carrinho")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3100);
    });

    expect(selectToasts(store.getState())).toHaveLength(0);
    jest.useRealTimers();
  });

  it("stacks multiple toasts independently", () => {
    const { store } = renderWithProviders(<ToastViewport />);

    act(() => {
      store.dispatch(addToast("Backpack adicionado ao carrinho"));
      store.dispatch(addToast("Boots removido do carrinho", "info"));
    });

    expect(screen.getByText("Backpack adicionado ao carrinho")).toBeInTheDocument();
    expect(screen.getByText("Boots removido do carrinho")).toBeInTheDocument();
  });
});
