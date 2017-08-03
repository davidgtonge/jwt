import React from "react"
import { connect } from "react-redux"
import HomePage from "./components/home"

const App = () => {
  return <HomePage />
}

const mapStateToProps = () => {
  return {}
}

const actionMap = {}

export default connect(mapStateToProps, actionMap)(App)
