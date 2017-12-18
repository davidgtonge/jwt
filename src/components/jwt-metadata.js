import React from "react"
import { Segment, Message } from "semantic-ui-react"
import R from "ramda"
import KJUR from "jsrsasign"

const decode = jwt => {
  try {
    const { payloadObj, headerObj } = KJUR.jws.JWS.parse(jwt)
    return { header: headerObj, payload: payloadObj }
  } catch (e) {
    return false
  }
}

const Item = ({ valid, title, titleX, description, descriptionX }) => {
  return (
    <Message positive={valid} negative={!valid}>
      <Message.Header>{valid ? title : titleX}</Message.Header>
      <p>{valid ? description : descriptionX}</p>
    </Message>
  )
}

export default function({ keys, jwt }) {
  const decoded = decode(jwt)
  if (!decoded) return null
  const kid = R.path(["header", "kid"])(decoded)
  const keyFound = kid && R.find(R.propEq("kid", kid))(keys || [])
  const expiry = decoded.payload.exp
  const notExpired = expiry > Date.now() / 1000
  let sigValid = false
  let jwtValid = false
  if (keyFound) {
    const key = KJUR.KEYUTIL.getKey(R.find(R.propEq("kid", kid))(keys))
    sigValid = KJUR.jws.JWS.verify(jwt, key)
    jwtValid = KJUR.jws.JWS.verifyJWT(jwt, key, {
      alg: [decoded.header.alg],
    })
  }

  return (
    <Segment padded>
      <h3 className="ui header">Token Details</h3>
      <Item
        valid={jwtValid}
        title="JWT is valid"
        titleX="JWT is invalid"
        description="The JWT has been verified and is valid for use. (NB in production applications the audience, subject and issuer claims should also be checked)"
        descriptionX="The JWT has not been verified and is not valid for use"
      />
      <Item
        valid={keyFound}
        title="Key found"
        titleX="Key not found"
        description="A key with a matching `kid` was found at the jwks endpoint "
        descriptionX="No matching key was found"
      />
      <Item
        valid={sigValid}
        title="Signature verified"
        titleX="Signature not verified"
        description="The signature of the JWT has been verified using a matching public key from the jwks endpoint"
        descriptionX="The  signature of the JWT has not been verified"
      />
      {expiry ? (
        <Item
          valid={notExpired}
          title="Not expired"
          titleX="Expired"
          descriptionX={`The JWT expired on ${new Date(
            decoded.payload.exp * 1000
          )}`}
          description={`The JWT will expire on ${new Date(
            decoded.payload.exp * 1000
          )}`}
        />
      ) : null}
    </Segment>
  )
}
