import * as R from "ramda";
import createReducer from "./helpers/create-reducer.ts";
import getKey from "./helpers/get-key.ts";
import {
  decodeJwt,
  getPayloadIssuer,
} from "./lib/jwt.ts";
import {
  ActionType,
  type AppAction,
  type AppState,
  type AppThunk,
} from "./types.ts";

export const reset = (): AppAction => ({ type: ActionType.RESET });

export const updateJWKS =
  (payload: string): AppThunk =>
  (dispatch, getState) => {
    dispatch({ type: ActionType.UPDATE_JWKS, payload });
    if (payload.indexOf("http") === 0 && !getState().keys[payload]) {
      getKey(payload, getState().useProxy, () =>
        dispatch({ type: ActionType.LOADING_KEYS }),
      )
        .then(({ keys }) => {
          if (getState().jwks !== payload) return;
          dispatch({
            type: ActionType.FETCHED_KEYS,
            payload: { uri: payload, keys },
          });
        })
        .catch(() => dispatch({ type: ActionType.ERROR_FETCHING_KEYS }));
    }
  };

export const updateJWT =
  (payload: string): AppThunk =>
  (dispatch, getState) => {
    dispatch({ type: ActionType.UPDATE_JWT, payload });
    if (!getState().jwks) {
      const token = decodeJwt(payload);
      const issuer = token ? getPayloadIssuer(token.payload) : undefined;
      if (issuer) {
        dispatch(updateJWKS(issuer));
      }
    }
  };

export const useProxy =
  (useProxyValue: boolean): AppThunk =>
  (dispatch) => {
    dispatch({
      type: ActionType.USE_PROXY,
      payload: { useProxy: useProxyValue },
    });
  };

const initialState: AppState = {
  loadingKeys: false,
  keys: {},
  jwks: "",
  jwt: "",
  useProxy: true,
};

export const reducer = createReducer<AppState>(initialState, {
  [ActionType.RESET]: () => () => initialState,
  [ActionType.UPDATE_JWT]: (payload) => R.assoc("jwt", payload),
  [ActionType.UPDATE_JWKS]: (payload) => R.assoc("jwks", payload),
  [ActionType.FETCHED_KEYS]: ({ uri, keys }) =>
    R.compose(
      R.assocPath(["keys", uri], keys),
      R.assoc("loadingKeys", false),
    ),
  [ActionType.ERROR_FETCHING_KEYS]: () => R.assoc("loadingKeys", false),
  [ActionType.LOADING_KEYS]: () => R.assoc("loadingKeys", true),
  [ActionType.USE_PROXY]: ({ useProxy: proxy }) => R.assoc("useProxy", proxy),
});
