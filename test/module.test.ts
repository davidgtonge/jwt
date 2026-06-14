import { describe, expect, it, vi } from "vitest";
import { reducer, updateJWT, updateJWKS, useProxy } from "../src/module.ts";
import { ActionType, type AppState } from "../src/types.ts";
import { validJwt } from "./helpers/fixtures.ts";

const initialState: AppState = {
  loadingKeys: false,
  keys: {},
  jwks: "",
  jwt: "",
  useProxy: true,
};

function dispatchThunk(
  thunk: ReturnType<typeof updateJWT>,
  state: AppState = initialState,
) {
  const actions: unknown[] = [];
  const dispatch = vi.fn((action: unknown) => {
    actions.push(action);
    if (typeof action === "function") {
      action(dispatch, () => state, undefined);
    }
  });
  const getState = vi.fn(() => state);

  thunk(dispatch, getState, undefined);

  return { dispatch, getState, actions };
}

describe("reducer", () => {
  it("updates jwt and jwks fields", () => {
    const withJwt = reducer(initialState, {
      type: ActionType.UPDATE_JWT,
      payload: "token",
    });
    const withJwks = reducer(withJwt, {
      type: ActionType.UPDATE_JWKS,
      payload: "https://issuer.example/jwks",
    });

    expect(withJwt.jwt).toBe("token");
    expect(withJwks.jwks).toBe("https://issuer.example/jwks");
  });

  it("stores fetched keys and clears loading state", () => {
    const loading = reducer(initialState, { type: ActionType.LOADING_KEYS });
    expect(loading.loadingKeys).toBe(true);

    const keys = [{ kid: "a", kty: "RSA" }];
    const fetched = reducer(loading, {
      type: ActionType.FETCHED_KEYS,
      payload: { uri: "https://example.com/jwks", keys },
    });

    expect(fetched.loadingKeys).toBe(false);
    expect(fetched.keys["https://example.com/jwks"]).toEqual(keys);
  });

  it("resets to initial state", () => {
    const changed = reducer(initialState, {
      type: ActionType.UPDATE_JWT,
      payload: "token",
    });
    const reset = reducer(changed, { type: ActionType.RESET });

    expect(reset).toEqual(initialState);
  });

  it("updates proxy setting", () => {
    const next = reducer(initialState, {
      type: ActionType.USE_PROXY,
      payload: { useProxy: false },
    });

    expect(next.useProxy).toBe(false);
  });
});

describe("updateJWT", () => {
  it("auto-fills jwks from issuer when jwks is empty", () => {
    const { dispatch } = dispatchThunk(updateJWT(validJwt));

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionType.UPDATE_JWT,
      payload: validJwt,
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: ActionType.UPDATE_JWKS,
      payload: "https://issuer.example",
    });
  });

  it("does not auto-fill jwks when one is already set", () => {
    const state = { ...initialState, jwks: "https://keys.example/jwks" };
    const { dispatch } = dispatchThunk(updateJWT(validJwt), state);

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionType.UPDATE_JWT,
      payload: validJwt,
    });
    expect(dispatch).not.toHaveBeenCalledWith({
      type: ActionType.UPDATE_JWKS,
      payload: "https://issuer.example",
    });
  });
});

describe("updateJWKS", () => {
  it("fetches keys for http urls and stores them", async () => {
    vi.useFakeTimers();
    const keys = [{ kid: "test", kty: "RSA" }];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ keys }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const actions: unknown[] = [];
    let state = initialState;
    const dispatch = vi.fn((action: unknown) => {
      actions.push(action);
      if (typeof action === "function") {
        action(dispatch, () => state, undefined);
        return;
      }
      if (
        typeof action === "object" &&
        action !== null &&
        "type" in action &&
        action.type === ActionType.UPDATE_JWKS
      ) {
        state = reducer(state, action as { type: typeof ActionType.UPDATE_JWKS; payload: string });
      }
      if (
        typeof action === "object" &&
        action !== null &&
        "type" in action &&
        action.type === ActionType.FETCHED_KEYS
      ) {
        state = reducer(state, action as {
          type: typeof ActionType.FETCHED_KEYS;
          payload: { uri: string; keys: typeof keys };
        });
      }
    });
    dispatch(updateJWKS("https://issuer.example/jwks"));
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://jwks.davetonge.co.uk/" + btoa("https://issuer.example/jwks"),
    );
    expect(state.keys["https://issuer.example/jwks"]).toEqual(keys);
    expect(state.loadingKeys).toBe(false);

    vi.unstubAllGlobals();
    vi.useRealTimers();
  });
});

describe("useProxy", () => {
  it("dispatches proxy preference", () => {
    const { dispatch } = dispatchThunk(useProxy(false));

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionType.USE_PROXY,
      payload: { useProxy: false },
    });
  });
});
