import "@testing-library/jest-dom";

// jsdom doesn't implement matchMedia; Framer Motion's useReducedMotion()
// (used internally by AnimatePresence/motion components) calls it, so
// without this every test that renders a motion component would throw.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
