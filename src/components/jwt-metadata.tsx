import { useEffect, useState } from "react";
import {
  decodeJwt,
  getHeaderKid,
  getPayloadExpiry,
  verifyJwt,
  type VerifyResult,
} from "../lib/jwt.ts";
import type { JwkKey } from "../types.ts";

type JWTMetadataProps = {
  keys?: readonly JwkKey[];
  jwt: string;
};

type StatusItemProps = {
  valid: boolean;
  title: string;
  titleX: string;
  description: string;
  descriptionX: string;
};

function StatusItem({
  valid,
  title,
  titleX,
  description,
  descriptionX,
}: StatusItemProps) {
  return (
    <div
      className={`rounded-md border p-4 ${
        valid
          ? "border-[var(--success)]/30 bg-[var(--success)]/10"
          : "border-[var(--error)]/30 bg-[var(--error)]/10"
      }`}
    >
      <p
        className={`font-medium ${valid ? "text-[var(--success)]" : "text-[var(--error)]"}`}
      >
        {valid ? title : titleX}
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        {valid ? description : descriptionX}
      </p>
    </div>
  );
}

export default function JWTMetadata({ keys, jwt }: JWTMetadataProps) {
  const [verification, setVerification] = useState<VerifyResult | null>(null);

  const decoded = decodeJwt(jwt);
  const kid = decoded ? getHeaderKid(decoded.header) : undefined;
  const expiry = decoded ? getPayloadExpiry(decoded.payload) : undefined;
  const notExpired = expiry !== undefined ? expiry > Date.now() / 1000 : false;

  useEffect(() => {
    if (!decoded || !kid || !keys?.length) {
      setVerification(null);
      return;
    }

    let cancelled = false;
    verifyJwt(jwt, keys, kid).then((result) => {
      if (!cancelled) setVerification(result);
    });

    return () => {
      cancelled = true;
    };
  }, [jwt, keys, kid, decoded]);

  if (!decoded) return null;

  const keyFound = verification?.keyFound ?? false;
  const sigValid = verification?.sigValid ?? false;
  const jwtValid = verification?.jwtValid ?? false;

  return (
    <section className="mb-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <h3 className="mb-4 text-lg font-medium text-[var(--text)]">Token Details</h3>
      <div className="space-y-3">
        <StatusItem
          valid={jwtValid}
          title="JWT is valid"
          titleX="JWT is invalid"
          description="The JWT has been verified and is valid for use. (NB in production applications the audience, subject and issuer claims should also be checked)"
          descriptionX="The JWT has not been verified and is not valid for use"
        />
        <StatusItem
          valid={keyFound}
          title="Key found"
          titleX="Key not found"
          description="A key with a matching `kid` was found at the jwks endpoint"
          descriptionX="No matching key was found"
        />
        <StatusItem
          valid={sigValid}
          title="Signature verified"
          titleX="Signature not verified"
          description="The signature of the JWT has been verified using a matching public key from the jwks endpoint"
          descriptionX="The signature of the JWT has not been verified"
        />
        {expiry !== undefined ? (
          <StatusItem
            valid={notExpired}
            title="Not expired"
            titleX="Expired"
            description={`The JWT will expire on ${new Date(expiry * 1000).toLocaleString()}`}
            descriptionX={`The JWT expired on ${new Date(expiry * 1000).toLocaleString()}`}
          />
        ) : null}
      </div>
    </section>
  );
}
