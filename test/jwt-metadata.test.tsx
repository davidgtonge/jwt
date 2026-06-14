import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import JWTMetadata from "../src/components/jwt-metadata.tsx";
import { testKeys, validJwt } from "./helpers/fixtures.ts";

describe("JWTMetadata", () => {
  it("shows verification status for a valid token", async () => {
    render(<JWTMetadata jwt={validJwt} keys={testKeys} />);

    await waitFor(() => {
      expect(screen.getByText("JWT is valid")).toBeTruthy();
      expect(screen.getByText("Key found")).toBeTruthy();
      expect(screen.getByText("Signature verified")).toBeTruthy();
      expect(screen.getByText("Not expired")).toBeTruthy();
    });
  });

  it("renders nothing for invalid tokens", () => {
    const { container } = render(<JWTMetadata jwt="not-a-jwt" keys={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows key not found when kid is missing from jwks", async () => {
    const otherKeys = testKeys.map((key) => ({ ...key, kid: "different-kid" }));

    render(<JWTMetadata jwt={validJwt} keys={otherKeys} />);

    await waitFor(() => {
      expect(screen.getByText("Key not found")).toBeTruthy();
      expect(screen.getByText("JWT is invalid")).toBeTruthy();
    });
  });
});
