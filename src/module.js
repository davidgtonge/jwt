import R from "ramda"
import createReducer from "./helpers/create-reducer"

// Types
const RESET = "RESET"

// Action Creators
export const reset = R.always({type:RESET, payload:{}})

// Reducer
const initialState = {}

const handleReset = R.always(initialState)

export const reducer = createReducer(initialState, {
  [RESET]: handleReset,
})
