import React from "react"
import ReactJson from "react-json-view"
import KJUR from "jsrsasign"
import { Segment } from "semantic-ui-react"
window.KJUR = KJUR

const decode = jwt => {
  try {
    const { payloadObj, headerObj } = KJUR.jws.JWS.parse(jwt)
    return { header: headerObj, payload: payloadObj }
  } catch (e) {
    console.log(e)
    return {}
  }
}

export default function JWTDetails({ jwt }) {
  const src = decode(jwt)

  return (
    <Segment padded style={{ minHeight: 380 }}>
      <h3 className="ui header">Decoded token</h3>
      <ReactJson src={src} displayDataTypes={false} name={false} />
    </Segment>
  )
}
