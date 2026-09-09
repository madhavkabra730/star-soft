import { render, screen } from "@testing-library/react";
import Template from "./template";

describe("Template", () => {
  it("renders its children", () => {
    render(
      <Template>
        <p>page content</p>
      </Template>,
    );
    expect(screen.getByText("page content")).toBeInTheDocument();
  });
});
