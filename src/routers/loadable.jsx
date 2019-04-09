import React, { Component } from 'react'
import Loadable from 'react-loadable'
import Loading from '../components/loading'

export default file => {
  return Loadable({
    loader: () => import(`page/${file}`),
    loading: Loading
  })
}
