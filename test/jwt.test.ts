import { describe, expect, it } from "vitest";
import {
  decodeJwt,
  getHeaderKid,
  getPayloadExpiry,
  getPayloadIssuer,
  verifyJwt,
} from "../src/lib/jwt.ts";
import { expiredJwt, testKid, testKeys, validJwt } from "./helpers/fixtures.ts";

describe("decodeJwt", () => {
  it("returns null for empty input", () => {
    expect(decodeJwt("")).toBeNull();
    expect(decodeJwt("   ")).toBeNull();
  });

  it("returns null for malformed tokens", () => {
    expect(decodeJwt("not.a.jwt")).toBeNull();
  });

  it("decodes a valid token", () => {
    const decoded = decodeJwt(validJwt);

    expect(decoded).not.toBeNull();
    expect(decoded?.header.alg).toBe("RS256");
    expect(decoded?.payload.sub).toBe("user-123");
    expect(decoded?.payload.iss).toBe("https://issuer.example");
  });
});

describe("jwt helpers", () => {
  it("extracts kid, issuer, and expiry", () => {
    const decoded = decodeJwt(validJwt)!;

    expect(getHeaderKid(decoded.header)).toBe(testKid);
    expect(getPayloadIssuer(decoded.payload)).toBe("https://issuer.example");
    expect(getPayloadExpiry(decoded.payload)).toBeTypeOf("number");
  });
});

describe("verifyJwt", () => {
  it("verifies a valid signature and jwt", async () => {
    const result = await verifyJwt(validJwt, testKeys, testKid);

    expect(result).toEqual({
      keyFound: true,
      sigValid: true,
      jwtValid: true,
    });
  });

  it("reports when kid is missing from jwks", async () => {
    const result = await verifyJwt(validJwt, testKeys, "missing-kid");

    expect(result).toEqual({
      keyFound: false,
      sigValid: false,
      jwtValid: false,
    });
  });

  it("reports invalid signature when token was tampered with", async () => {
    const tampered = `${validJwt.slice(0, -4)}xxxx`;
    const result = await verifyJwt(tampered, testKeys, testKid);

    expect(result.keyFound).toBe(true);
    expect(result.sigValid).toBe(false);
    expect(result.jwtValid).toBe(false);
  });

  it("reports invalid jwt when token is expired", async () => {
    const result = await verifyJwt(expiredJwt, testKeys, testKid);

    expect(result.keyFound).toBe(true);
    expect(result.sigValid).toBe(true);
    expect(result.jwtValid).toBe(false);
  });
});
