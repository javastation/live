import React, { compoent } from 'react'
import LoadableComponent from './loadable'

const routes = [
  {
    path: '/',
    file: 'index',
    exact: true
  },
  {
    path: '/live',
    file: 'live'
  },
  {
    path: '/test',
    file: 'test'
  }
]
export default routes
