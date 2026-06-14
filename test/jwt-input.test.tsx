import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import JWTInput from "../src/components/jwt-input.tsx";

describe("JWTInput", () => {
  it("renders and forwards input changes", async () => {
    const user = userEvent.setup();
    const updateJWT = vi.fn();

    render(<JWTInput jwt="" updateJWT={updateJWT} />);

    expect(screen.getByText("Enter JWT")).toBeTruthy();

    await user.type(screen.getByPlaceholderText("Enter JWT"), "abc");
    expect(updateJWT).toHaveBeenCalled();
    expect(updateJWT.mock.calls.at(-1)?.[0]).toContain("c");
  });

  it("shows the current jwt value", () => {
    render(
      <JWTInput jwt="header.payload.signature" updateJWT={vi.fn()} />,
    );

    expect(screen.getByDisplayValue("header.payload.signature")).toBeTruthy();
  });
});
