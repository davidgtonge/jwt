import React from "react"
import { connect } from "react-redux"
import { updateJWT, updateJWKS } from "./module"

import { Grid } from "semantic-ui-react"
import Title from "./components/title"
import JWTInput from "./components/jwt-input"
import JWKSInput from "./components/jwks-input"
import JWTDetails from "./components/jwt-details"
import JWKSDetails from "./components/jwks-details"
import JWTMetadata from "./components/jwt-metadata"

const App = ({ jwt, updateJWT, jwks, updateJWKS, loadingKeys, jwksKeys }) => {
  return (
    <div>
      <Title />

      <Grid padded="horizontally" stackable verticalAlign="top">
        <Grid.Row>
          <Grid.Column width={6}>
            <JWTInput jwt={jwt} updateJWT={updateJWT} />
            <JWKSInput
              jwks={jwks}
              updateJWKS={updateJWKS}
              loading={loadingKeys}
            />
            <JWKSDetails keys={jwksKeys} />
          </Grid.Column>
          <Grid.Column width={10}>
            <Grid.Row>
              <JWTMetadata keys={jwksKeys} jwt={jwt} />
              <JWTDetails jwt={jwt} />
            </Grid.Row>
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

const actionMap = { updateJWT, updateJWKS }

export default connect(mapStateToProps, actionMap)(App)
