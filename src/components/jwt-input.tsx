type JWTInputProps = {
  jwt: string;
  updateJWT: (value: string) => void;
};

export default function JWTInput({ jwt, updateJWT }: JWTInputProps) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <h3 className="mb-3 text-lg font-medium text-[var(--text)]">Enter JWT</h3>
      <textarea
        placeholder="Enter JWT"
        value={jwt}
        onChange={(e) => updateJWT(e.target.value)}
        className="h-28 w-full resize-none rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] p-3 font-mono text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
      />
    </section>
  );
}
