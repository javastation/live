import React from 'react'
import ReactDom from 'react-dom'
// import store from './redux/store'
import App from './App'
import 'webrtc-adapter'
import './util/axios'

console.log(process.env.NODE_ENV)
const render = RootElement => {
  ReactDom.render(
    <div>
      <RootElement />
    </div>,
    document.getElementById('app')
  )
}

/* 初始化 */
render(App)
