import R from "ramda"
import createReducer from "./helpers/create-reducer"
import getKey from "./helpers/get-key"
import KJUR from "jsrsasign"

const decode = jwt => {
  try {
    const { payloadObj, headerObj } = KJUR.jws.JWS.parse(jwt)
    return { header: headerObj, payload: payloadObj }
  } catch (e) {
    console.log(e)
    return {}
  }
}

// Types
const RESET = "RESET"
const UPDATE_JWT = "UPDATE_JWT"
const UPDATE_JWKS = "UPDATE_JWKS"
const LOADING_KEYS = "LOADING_KEYS"
const FETCHED_KEYS = "FETCHED_KEYS"
const ERROR_FETCHING_KEYS = "ERROR_FETCHING_KEYS"
const USE_PROXY = "USE_PROXY"

// Action Creators
export const reset = R.always({ type: RESET, payload: {} })

export const updateJWKS = payload => (dispatch, getState) => {
  dispatch({ type: UPDATE_JWKS, payload })
  if (payload.indexOf("http") === 0 && !getState().keys[payload]) {
    getKey(payload, getState().useProxy, () => dispatch({ type: LOADING_KEYS, payload: {} }))
      .then(({ keys, uri }) => {
        if (uri !== payload) return
        dispatch({
          type: FETCHED_KEYS,
          payload: { uri: payload, keys },
        })
      })
      .catch(() => dispatch({ type: ERROR_FETCHING_KEYS, payload: {} }))
  }
}


export const updateJWT = payload => (dispatch, getState) => {
  dispatch({ type: UPDATE_JWT, payload })
  console.log("check state", getState().jwks)
  if (!getState().jwks) {
    const token = decode(payload)
    console.log({token})
    if (token.payload && token.payload.iss) {
      updateJWKS(token.payload.iss)(dispatch, getState)
    }
  }
}

export const useProxy = useProxy => (dispatch, getState) => {
  dispatch({
    type: USE_PROXY,
    payload: {useProxy: useProxy},
  })
  console.log("use proxy", getState().useProxy)
}

// Reducer
const initialState = {
  loadingKeys: false,
  keys: {},
  jwks: "",
  jwt: "",
  useProxy: true,
}

export const reducer = createReducer(initialState, {
  [RESET]: payload => state => initialState,
  [UPDATE_JWT]: R.assoc("jwt"),
  [UPDATE_JWKS]: R.assoc("jwks"),
  [FETCHED_KEYS]: ({ uri, keys }) =>
    R.compose(R.assocPath(["keys", uri], keys), R.assoc("loadingKeys", false)),
  [ERROR_FETCHING_KEYS]: () => R.assoc("loadingKeys", false),
  [LOADING_KEYS]: () => R.assoc("loadingKeys", true),
  [USE_PROXY]: ({useProxy}) => R.assoc("useProxy", useProxy),
})
