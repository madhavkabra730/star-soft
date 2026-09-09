import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("shows the Starsoft copyright with the current year", () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(`Starsoft.*${new Date().getFullYear()}`))).toBeInTheDocument();
  });
});
