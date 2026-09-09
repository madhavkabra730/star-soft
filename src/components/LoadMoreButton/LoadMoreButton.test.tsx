import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoadMoreButton } from "./LoadMoreButton";

describe("LoadMoreButton", () => {
  it('shows "Carregar mais" and is clickable when there is more to load', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<LoadMoreButton onClick={onClick} isLoading={false} hasMore />);

    const button = screen.getByRole("button", { name: "Carregar mais" });
    expect(button).toBeEnabled();

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows a loading label and disables the button while fetching the next page", () => {
    render(<LoadMoreButton onClick={jest.fn()} isLoading hasMore />);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it('shows "Você já viu tudo" and is disabled once every page has loaded', () => {
    render(<LoadMoreButton onClick={jest.fn()} isLoading={false} hasMore={false} />);
    const button = screen.getByRole("button", { name: "Você já viu tudo" });
    expect(button).toBeDisabled();
  });
});
