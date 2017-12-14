import React from "react"
import { Form, TextArea, Segment } from "semantic-ui-react"

export default function JWTInput({ jwt, updateJWT }) {
  return (
    <Segment
      padded
      style={{
        height: "150px",
        overflowY: "scroll",
      }}
    >
      <h3 className="ui header">Enter JWT</h3>
      <Form style={{ opacity: 0.8 }}>
        <TextArea
          placeholder="Enter JWT"
          value={jwt}
          autoHeight={true}
          style={{ fontFamily: "monospace" }}
          onChange={(e, data) => updateJWT(data.value)}
        />
      </Form>
    </Segment>
  )
}
