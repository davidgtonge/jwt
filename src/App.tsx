import { connect, type ConnectedProps } from "react-redux";
import Title from "./components/title.tsx";
import JWTInput from "./components/jwt-input.tsx";
import JWKSInput from "./components/jwks-input.tsx";
import JWTDetails from "./components/jwt-details.tsx";
import JWKSDetails from "./components/jwks-details.tsx";
import JWTMetadata from "./components/jwt-metadata.tsx";
import { updateJWT, updateJWKS, useProxy } from "./module.ts";
import type { AppState } from "./types.ts";

const content =
  "There are some great jwt debuggers online, but this one verifies tokens using jwks endpoints. Simply paste your jwt and the url of either the jwks endpoint or the issuer domain that contains the OpenID Configuration and the site will attempt to check the signature and verify the jwt.";

function App({
  jwt,
  updateJWT,
  jwks,
  updateJWKS,
  useProxy,
  loadingKeys,
  jwksKeys,
}: ConnectedProps<typeof connector>) {
  return (
    <div className="min-h-screen pb-8">
      <Title />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <section className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-4">
            <h2 className="mb-2 font-medium text-[var(--text)]">
              Verify JWTs with public JWKS endpoints
            </h2>
            <p className="text-sm text-[var(--text-muted)]">{content}</p>
          </section>

          <JWTInput jwt={jwt} updateJWT={updateJWT} />
          <JWKSInput
            jwks={jwks}
            updateJWKS={updateJWKS}
            loading={loadingKeys}
            useProxy={useProxy}
          />
          <JWKSDetails keys={jwksKeys} />
          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <a
              href={`/#jwt=${encodeURIComponent(jwt)}&jwks=${encodeURIComponent(jwks)}`}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Sharable link
            </a>
          </section>
        </div>

        <div className="space-y-4 lg:col-span-7">
          <JWTMetadata keys={jwksKeys} jwt={jwt} />
          <JWTDetails jwt={jwt} />
        </div>
      </div>

      <footer className="mx-auto mt-12 max-w-7xl border-t border-[var(--border)] px-4 pt-6 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          An open source project by{" "}
          <a
            href="https://github.com/davidgtonge"
            className="text-[var(--accent)] hover:underline"
          >
            @davidgtonge
          </a>
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <a
            href="https://twitter.com/davidgtonge"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--text)]"
            aria-label="Twitter"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://github.com/davidgtonge"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--text)]"
            aria-label="GitHub"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://medium.com/@davidgtonge"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--text)]"
            aria-label="Medium"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
            </svg>
          </a>
          <a
            href="http://openid.net/wg/fapi/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--text)]"
            aria-label="OpenID FAPI"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="9" r="3" />
              <path d="M7 18c0-2.761 2.239-5 5-5s5 2.239 5 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}

const mapStateToProps = (state: AppState) => ({
  jwt: state.jwt,
  jwks: state.jwks,
  loadingKeys: state.loadingKeys,
  jwksKeys: state.keys[state.jwks],
});

const actionMap = { updateJWT, updateJWKS, useProxy };
const connector = connect(mapStateToProps, actionMap);

export default connector(App);
