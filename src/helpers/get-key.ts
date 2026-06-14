import debounce from "debounce-promise";
import type { JwkKey, JwksResponse } from "../types.ts";

const PROXY = "https://jwks.davetonge.co.uk/";

function isJwkKey(value: unknown): value is JwkKey {
  return typeof value === "object" && value !== null;
}

function parseJwksResponse(data: unknown): Pick<JwksResponse, "keys"> {
  if (
    typeof data !== "object" ||
    data === null ||
    !("keys" in data) ||
    !Array.isArray(data.keys) ||
    !data.keys.every(isJwkKey)
  ) {
    throw new Error("Invalid JWKS response");
  }

  return { keys: data.keys };
}

const getKey = (
  uri: string,
  useProxy: boolean,
  onStart: () => void,
): Promise<JwksResponse> => {
  const fetchUri = useProxy ? PROXY + btoa(uri) : uri;
  onStart();

  return fetch(fetchUri)
    .then((res) => {
      if (!res.ok) throw new Error(`JWKS fetch failed: ${res.status}`);
      return res.json() as Promise<unknown>;
    })
    .then(parseJwksResponse)
    .then(({ keys }) => ({ keys, uri: fetchUri }));
};

export default debounce(getKey, 1000);
