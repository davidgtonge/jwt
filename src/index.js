import "semantic-ui-css/semantic.min.css"
import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { applyMiddleware, createStore } from "redux"
import thunk from "redux-thunk"
import promise from "redux-promise"
import { createLogger } from "redux-logger"
import qs from "querystring"

import { reducer, reset, updateJWT, updateJWKS } from "./module"
import App from "./App"

const logger = createLogger({
  predicate: (getState, action) => action.type !== "TICK",
})
const store = createStore(reducer, applyMiddleware(thunk, promise, logger))
store.dispatch(reset())

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
)

const hash = window.location.hash.substr(1)
if (hash) {
  const { jwt, jwks } = qs.parse(hash)
  if (jwt) {
    store.dispatch(updateJWT(jwt))
  }
  if (jwks) {
    store.dispatch(updateJWKS(jwks))
  }
}
