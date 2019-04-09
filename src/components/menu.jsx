import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Index extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <Link to="/">index</Link>
        <Link to="/live">live</Link>
      </div>
    )
  }
}
