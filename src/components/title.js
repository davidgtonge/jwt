import React from "react"
import { Container, Header } from "semantic-ui-react"

export default function() {
  return (
    <Container text>
      <Header
        as="h1"
        content="JSON Web Token Verifier"
        style={{
          fontSize: "3em",
          fontWeight: "normal",
          margin: "0.5em",
        }}
      />
    </Container>
  )
}
