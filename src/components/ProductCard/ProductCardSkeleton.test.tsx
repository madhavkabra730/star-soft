import { render } from "@testing-library/react";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

describe("ProductCardSkeleton", () => {
  it("renders as a decorative, screen-reader-hidden placeholder", () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container.firstChild).toHaveAttribute("aria-hidden");
  });
});
