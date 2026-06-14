import type { JwkKey } from "../types.ts";

type JWKSDetailsProps = {
  keys?: readonly JwkKey[];
};

function formatKeyUse(use?: JwkKey["use"]): string {
  if (use?.toLowerCase() === "sig") return "Signing";
  if (use?.toLowerCase() === "enc") return "Encryption";
  return use ?? "";
}

export default function JWKSDetails({ keys = [] }: JWKSDetailsProps) {
  if (keys.length === 0) return null;

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <h3 className="mb-3 text-lg font-medium text-[var(--text)]">
        Found {keys.length} keys
      </h3>
      <ul className="divide-y divide-[var(--border)]">
        {keys.map(({ kid, alg, use, kty }, idx) => (
          <li key={kid ?? idx} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
            <div>
              <p className="font-medium text-[var(--text)]">
                {alg || kty} {formatKeyUse(use)} key
              </p>
              <p className="font-mono text-sm text-[var(--text-muted)]">kid: {kid}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
