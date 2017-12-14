import React from "react"
import { List, Segment } from "semantic-ui-react"

const getUse = (use = "") => {
  if (use.toLowerCase() === "sig") {
    return "Signing"
  }
  if (use.toLowerCase() === "enc") {
    return "Encryption"
  }
  return use
}

export default function(props) {
  const keys = props.keys || []
  if (keys.length === 0) return null
  return (
    <Segment padded>
      <h3 className="ui header">Found {keys.length} keys</h3>
      <List divided relaxed>
        {keys.map(({ kid, alg, use, kty }, idx) => (
          <List.Item key={idx}>
            <List.Icon name="key" size="large" verticalAlign="middle" />
            <List.Content>
              <List.Header as="a">
                {alg || kty} {getUse(use)} key
              </List.Header>
              <List.Description as="a">kid: {kid}</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Segment>
  )
}
