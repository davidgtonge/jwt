import R from "ramda"

const createReducer = (initialState, spec) => {
  return (state = initialState, action) => {
    return R.cond([
      [R.is(Array), R.reduce((_state, fn) => fn(_state, action), state)],
      [R.is(Function), (fn) => fn(state, action)],
      [R.T, R.always(state)],
    ])(spec[action.type])
  }
}

export default createReducer
