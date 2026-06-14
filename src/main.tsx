import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";
import App from "./App.tsx";
import { reducer, reset, updateJWT, updateJWKS } from "./module.ts";
import type { AppStore } from "./types.ts";
import "./styles.css";

const store: AppStore = createStore(
  reducer,
  applyMiddleware(thunk),
) as AppStore;

store.dispatch(reset());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);

const params = new URLSearchParams(window.location.hash.slice(1));
const jwt = params.get("jwt");
const jwks = params.get("jwks");
if (jwt) {
  store.dispatch(updateJWT(jwt));
}
if (jwks) {
  store.dispatch(updateJWKS(jwks));
}
