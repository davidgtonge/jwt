import type { JWK } from "jose";
import type { ThunkAction, ThunkDispatch } from "redux-thunk";

/** A public key from a JWKS endpoint, with common claim fields surfaced. */
export type JwkKey = JWK & {
  kid?: string;
  alg?: string;
  use?: "sig" | "enc" | (string & {});
  kty?: string;
};

export type JwksResponse = {
  keys: JwkKey[];
  uri: string;
};

export type AppState = {
  loadingKeys: boolean;
  keys: Record<string, JwkKey[]>;
  jwks: string;
  jwt: string;
  useProxy: boolean;
};

export const ActionType = {
  RESET: "RESET",
  UPDATE_JWT: "UPDATE_JWT",
  UPDATE_JWKS: "UPDATE_JWKS",
  LOADING_KEYS: "LOADING_KEYS",
  FETCHED_KEYS: "FETCHED_KEYS",
  ERROR_FETCHING_KEYS: "ERROR_FETCHING_KEYS",
  USE_PROXY: "USE_PROXY",
} as const;

export type ActionTypeName = (typeof ActionType)[keyof typeof ActionType];

export type FetchedKeysPayload = {
  uri: string;
  keys: JwkKey[];
};

export type UseProxyPayload = {
  useProxy: boolean;
};

export type AppAction =
  | { type: typeof ActionType.RESET }
  | { type: typeof ActionType.UPDATE_JWT; payload: string }
  | { type: typeof ActionType.UPDATE_JWKS; payload: string }
  | { type: typeof ActionType.LOADING_KEYS }
  | { type: typeof ActionType.ERROR_FETCHING_KEYS }
  | { type: typeof ActionType.FETCHED_KEYS; payload: FetchedKeysPayload }
  | { type: typeof ActionType.USE_PROXY; payload: UseProxyPayload };

/** Payload for a given action type; `never` when the action carries no payload. */
export type ActionPayload<T extends ActionTypeName> = Extract<
  AppAction,
  { type: T }
> extends { payload: infer P }
  ? P
  : never;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  AppAction
>;

export type AppDispatch = ThunkDispatch<AppState, unknown, AppAction>;

export type AppStore = import("redux").Store<AppState, AppAction> & {
  dispatch: AppDispatch;
};
