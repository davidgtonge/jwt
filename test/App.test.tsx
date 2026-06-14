import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { describe, expect, it } from "vitest";
import App from "../src/App.tsx";
import { reducer } from "../src/module.ts";
import type { AppStore } from "../src/types.ts";

describe("App", () => {
  it("renders without crashing", () => {
    const store = createStore(reducer) as AppStore;
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    expect(screen.getByText("JSON Web Token Verifier")).toBeTruthy();
  });
});
