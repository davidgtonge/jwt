import debounce from "debounce-promise"
import R from "ramda"

const PROXY = "https://jwks.davetonge.co.uk/"

const getKey = (uri, onStart) => {
  onStart()
  return fetch(PROXY + btoa(uri))
    .then(res => res.json())
    .then(R.pick(["keys"]))
    .then(R.assoc("uri", uri))
}

export default debounce(getKey, 1000)
