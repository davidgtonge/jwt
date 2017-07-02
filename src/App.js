import React from "react"
import { connect } from "react-redux"
import { Grid, Row, Col } from "react-bootstrap"

const App = () => {
  return (
    <Grid>
      <Row>
        <Col xs={12}>
          <h1>Starter App</h1>
          <p>Test</p>
        </Col>
      </Row>
    </Grid>
  )
}

const mapStateToProps = () => {
  return {}
}

const actionMap = {}

export default connect(mapStateToProps, actionMap)(App)
