import React from "react"
import { Container, Header, Icon } from "semantic-ui-react"

export default function() {
  return (
    <Container text>
      <Header
        as="h1"
        style={{
          fontSize: "2.5em",
          fontWeight: "normal",
          margin: "0.5em",
        }}
      >
        <Icon name="key" size="small" />
        <Header.Content>JSON Web Token Verifier</Header.Content>
      </Header>
    </Container>
  )
}
