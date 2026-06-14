import {
  ActionType,
  type AppAction,
  type FetchedKeysPayload,
  type UseProxyPayload,
} from "../types.ts";

type StateUpdater<S> = (state: S) => S;

export type ReducerSpec<S> = {
  [ActionType.RESET]?: () => StateUpdater<S>;
  [ActionType.UPDATE_JWT]?: (payload: string) => StateUpdater<S>;
  [ActionType.UPDATE_JWKS]?: (payload: string) => StateUpdater<S>;
  [ActionType.LOADING_KEYS]?: () => StateUpdater<S>;
  [ActionType.ERROR_FETCHING_KEYS]?: () => StateUpdater<S>;
  [ActionType.FETCHED_KEYS]?: (payload: FetchedKeysPayload) => StateUpdater<S>;
  [ActionType.USE_PROXY]?: (payload: UseProxyPayload) => StateUpdater<S>;
};

const createReducer = <S>(initialState: S, spec: ReducerSpec<S>) => {
  return (state: S | undefined, action: AppAction | { type: string }): S => {
    const currentState = state ?? initialState;

    switch (action.type) {
      case ActionType.RESET:
        return spec[ActionType.RESET]?.()(currentState) ?? currentState;
      case ActionType.UPDATE_JWT:
        return (
          spec[ActionType.UPDATE_JWT]?.(
            (action as Extract<AppAction, { type: typeof ActionType.UPDATE_JWT }>)
              .payload,
          )(currentState) ?? currentState
        );
      case ActionType.UPDATE_JWKS:
        return (
          spec[ActionType.UPDATE_JWKS]?.(
            (action as Extract<AppAction, { type: typeof ActionType.UPDATE_JWKS }>)
              .payload,
          )(currentState) ?? currentState
        );
      case ActionType.LOADING_KEYS:
        return spec[ActionType.LOADING_KEYS]?.()(currentState) ?? currentState;
      case ActionType.ERROR_FETCHING_KEYS:
        return (
          spec[ActionType.ERROR_FETCHING_KEYS]?.()(currentState) ?? currentState
        );
      case ActionType.FETCHED_KEYS:
        return (
          spec[ActionType.FETCHED_KEYS]?.(
            (action as Extract<AppAction, { type: typeof ActionType.FETCHED_KEYS }>)
              .payload,
          )(currentState) ?? currentState
        );
      case ActionType.USE_PROXY:
        return (
          spec[ActionType.USE_PROXY]?.(
            (action as Extract<AppAction, { type: typeof ActionType.USE_PROXY }>)
              .payload,
          )(currentState) ?? currentState
        );
      default:
        return currentState;
    }
  };
};

export default createReducer;
