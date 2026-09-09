import toastReducer, { addToast, removeToast } from "./toastSlice";

describe("toastSlice", () => {
  it("adds a toast with a generated id and default success variant", () => {
    const state = toastReducer([], addToast("Item adicionado ao carrinho"));

    expect(state).toHaveLength(1);
    expect(state[0]).toMatchObject({ message: "Item adicionado ao carrinho", variant: "success" });
    expect(state[0].id).toEqual(expect.any(String));
  });

  it("supports an explicit variant", () => {
    const state = toastReducer([], addToast("Item removido do carrinho", "info"));
    expect(state[0].variant).toBe("info");
  });

  it("assigns a distinct id per toast", () => {
    const first = toastReducer([], addToast("A"));
    const state = toastReducer(first, addToast("B"));

    expect(state).toHaveLength(2);
    expect(state[0].id).not.toBe(state[1].id);
  });

  it("removes a toast by id, leaving the others", () => {
    const withA = toastReducer([], addToast("A"));
    const withBoth = toastReducer(withA, addToast("B"));

    const state = toastReducer(withBoth, removeToast(withBoth[0].id));

    expect(state).toHaveLength(1);
    expect(state[0].message).toBe("B");
  });

  it("removeToast is a no-op for an id that isn't present", () => {
    const before = toastReducer([], addToast("A"));
    const state = toastReducer(before, removeToast("nonexistent"));
    expect(state).toEqual(before);
  });
});
