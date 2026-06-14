# JSON Web Token Verifier

![CI](https://github.com/davidgtonge/jwt/actions/workflows/ci.yml/badge.svg)

A small web app for verifying JWTs against public JWKS endpoints. Paste a token and either a JWKS URL or an issuer domain — the app fetches keys, checks the signature, and shows claim details.

**Live:** https://jwt.davetonge.co.uk

## Features

- Decode JWT headers and payloads
- Fetch JWKS from a URL or discover keys via OpenID issuer
- Verify signatures with [`jose`](https://github.com/panva/jose)
- Optional CORS proxy for browser-based JWKS requests
- Sharable links via URL hash (`#jwt=...&jwks=...`)

## Development

Requires Node.js 20+.

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck and production build |
| `npm run preview` | Preview production build |
| `npm test` | Run Vitest tests |
| `npm run typecheck` | TypeScript check only |

## Stack

- React 19 + Redux + redux-thunk
- TypeScript + Vite
- Tailwind CSS v4
- Deployed on Vercel (`now.json`)

## License

Private — see repository owner.
