const link1 = "https://www.googleapis.com/oauth2/v3/certs";
const link2 = "https://accounts.google.com";

type JWKSInputProps = {
  jwks: string;
  updateJWKS: (value: string) => void;
  useProxy: (value: boolean) => void;
  loading: boolean;
};

export default function JWKSInput({
  jwks,
  updateJWKS,
  useProxy,
  loading,
}: JWKSInputProps) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <h3 className="mb-3 text-lg font-medium text-[var(--text)]">
        Enter jwks endpoint or issuer domain
      </h3>
      <div className="relative">
        <input
          type="text"
          value={jwks}
          onChange={(e) => updateJWKS(e.target.value)}
          placeholder="Enter JWKS"
          className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 pr-10 font-mono text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        )}
      </div>
      <p className="mt-3 text-sm text-[var(--text-muted)]">
        For example:{" "}
        <button
          type="button"
          onClick={() => updateJWKS(link1)}
          className="text-[var(--accent)] hover:underline"
        >
          {link1}
        </button>{" "}
        or{" "}
        <button
          type="button"
          onClick={() => updateJWKS(link2)}
          className="text-[var(--accent)] hover:underline"
        >
          {link2}
        </button>
      </p>
      <label className="mt-4 flex items-center gap-2 text-sm text-[var(--text)]">
        <input
          type="checkbox"
          defaultChecked
          onChange={(e) => useProxy(e.target.checked)}
          className="rounded border-[var(--border)]"
        />
        Use proxy
      </label>
      <p className="mt-2 text-xs text-[var(--text-muted)]">
        Request is optionally sent via a{" "}
        <a
          href="https://github.com/davidgtonge/jwks-proxy"
          className="text-[var(--accent)] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          proxy
        </a>{" "}
        as most JWKS endpoints aren&apos;t available cross-origin.
      </p>
    </section>
  );
}
