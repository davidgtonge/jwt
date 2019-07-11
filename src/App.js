import React from "react"
import { connect } from "react-redux"
import { updateJWT, updateJWKS, useProxy } from "./module"

import { Grid, Message, Divider, Segment, Icon } from "semantic-ui-react"
import Title from "./components/title"
import JWTInput from "./components/jwt-input"
import JWKSInput from "./components/jwks-input"
import JWTDetails from "./components/jwt-details"
import JWKSDetails from "./components/jwks-details"
import JWTMetadata from "./components/jwt-metadata"

const content = `
There are some great jwt debuggers online, but this one verifies tokens using jwks endpoints. 
Simply paste your jwt and the url of either the jwks endpoint or the issuer 
domain that contains the OpenID Configuration and the site will attempt to 
check the signature and verify the jwt.
`

const App = ({ jwt, updateJWT, jwks, updateJWKS, useProxy, loadingKeys, jwksKeys }) => {
  return (
    <div>
      <Title />

      <Grid padded="horizontally" stackable verticalAlign="top">
        <Grid.Row>
          <Grid.Column width={6}>
            <Message
              icon="key"
              content={content}
              header="Verify JWTs with public JWKS endpoints"
            />
            <JWTInput jwt={jwt} updateJWT={updateJWT} />
            <JWKSInput
              jwks={jwks}
              updateJWKS={updateJWKS}
              loading={loadingKeys}
              useProxy={useProxy}
            />
            <JWKSDetails keys={jwksKeys} />
            <Segment>
              <a href={`/#jwt=${jwt}&jwks=${jwks}`}>Sharable link</a>
            </Segment>
          </Grid.Column>
          <Grid.Column width={10}>
            <Grid.Row>
              <JWTMetadata keys={jwksKeys} jwt={jwt} />
              <JWTDetails jwt={jwt} />
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment inverted>
              <Divider horizontal inverted>
                <p style={{ textAlign: "center" }}>
                  An open source project by{" "}
                  <a href="https://github.com/davidgtonge">@davidgtonge</a>
                </p>
              </Divider>
              <p style={{ textAlign: "center" }}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://twitter.com/davidgtonge"
                >
                  <Icon name="twitter" size="large" />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/davidgtonge"
                >
                  <Icon name="github" size="large" />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://medium.com/@davidgtonge"
                >
                  <Icon name="medium" size="large" />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://openid.net/wg/fapi/"
                >
                  <Icon name="openid" size="large" />
                </a>
              </p>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    jwt: state.jwt,
    jwks: state.jwks,
    loadingKeys: state.loadingKeys,
    jwksKeys: state.keys[state.jwks],
  }
}

const actionMap = { updateJWT, updateJWKS, useProxy }

export default connect(mapStateToProps, actionMap)(App)
