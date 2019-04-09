import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

export default class Index extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <Link to="/s">son</Link>
        <Link to="/ss">sson</Link>
      </div>
    )
  }
}
