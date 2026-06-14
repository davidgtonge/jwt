import { describe, expect, it } from "vitest";
import createReducer from "../src/helpers/create-reducer.ts";
import { ActionType } from "../src/types.ts";

type TestState = {
  value: string;
};

describe("createReducer", () => {
  const initialState: TestState = { value: "initial" };
  const reducer = createReducer<TestState>(initialState, {
    [ActionType.UPDATE_JWT]: (payload) => () => ({ value: payload }),
  });

  it("returns initial state for undefined state", () => {
    expect(reducer(undefined, { type: ActionType.UPDATE_JWT, payload: "x" })).toEqual({
      value: "x",
    });
  });

  it("ignores unknown actions", () => {
    const state = { value: "keep" };
    expect(reducer(state, { type: "UNKNOWN" })).toBe(state);
  });
});
