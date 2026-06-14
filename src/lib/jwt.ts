import * as jose from "jose";
import type { JwkKey } from "../types.ts";

export type DecodedJwt = {
  header: jose.ProtectedHeaderParameters;
  payload: jose.JWTPayload;
};

export type VerifyResult = {
  keyFound: boolean;
  sigValid: boolean;
  jwtValid: boolean;
};

export function getHeaderKid(
  header: jose.ProtectedHeaderParameters,
): string | undefined {
  return typeof header.kid === "string" ? header.kid : undefined;
}

export function getPayloadIssuer(
  payload: jose.JWTPayload,
): string | undefined {
  return typeof payload.iss === "string" ? payload.iss : undefined;
}

export function getPayloadExpiry(
  payload: jose.JWTPayload,
): number | undefined {
  return typeof payload.exp === "number" ? payload.exp : undefined;
}

export function decodeJwt(token: string): DecodedJwt | null {
  if (!token.trim()) return null;

  try {
    return {
      header: jose.decodeProtectedHeader(token),
      payload: jose.decodeJwt(token),
    };
  } catch {
    return null;
  }
}

export async function verifyJwt(
  token: string,
  keys: readonly JwkKey[],
  kid: string,
): Promise<VerifyResult> {
  const jwk = keys.find((key) => key.kid === kid);
  if (!jwk) {
    return { keyFound: false, sigValid: false, jwtValid: false };
  }

  const header = jose.decodeProtectedHeader(token);
  const alg = header.alg;
  if (!alg) {
    return { keyFound: true, sigValid: false, jwtValid: false };
  }

  try {
    const key = await jose.importJWK(jwk, alg);

    let sigValid = false;
    try {
      await jose.compactVerify(token, key);
      sigValid = true;
    } catch {
      sigValid = false;
    }

    let jwtValid = false;
    try {
      await jose.jwtVerify(token, key, { algorithms: [alg] });
      jwtValid = true;
    } catch {
      jwtValid = false;
    }

    return { keyFound: true, sigValid, jwtValid };
  } catch {
    return { keyFound: true, sigValid: false, jwtValid: false };
  }
}
