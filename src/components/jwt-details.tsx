import ReactJson from "@microlink/react-json-view";
import { decodeJwt } from "../lib/jwt.ts";

type JWTDetailsProps = {
  jwt: string;
};

export default function JWTDetails({ jwt }: JWTDetailsProps) {
  const decoded = decodeJwt(jwt);
  const src = decoded ?? {};

  return (
    <section className="min-h-96 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <h3 className="mb-3 text-lg font-medium text-[var(--text)]">Decoded token</h3>
      <div className="overflow-auto rounded-md bg-[var(--surface-elevated)] p-3 font-mono text-sm">
        <ReactJson
          src={src}
          displayDataTypes={false}
          name={false}
          theme="monokai"
          style={{ background: "transparent" }}
        />
      </div>
    </section>
  );
}
