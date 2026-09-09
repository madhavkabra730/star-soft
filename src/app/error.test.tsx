import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GlobalError from "./error";

describe("GlobalError", () => {
  it("logs the error and lets the user retry", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    const reset = jest.fn();
    const error = Object.assign(new Error("boom"), { digest: "abc123" });
    const user = userEvent.setup();

    render(<GlobalError error={error} reset={reset} />);

    expect(consoleError).toHaveBeenCalledWith(error);
    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(reset).toHaveBeenCalledTimes(1);

    consoleError.mockRestore();
  });
});
