import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux' // 让所有容器组件都可以访问store，而不必显示地传递它。只需要在渲染根组件时使用即可。
import { BrowserRouter as Router, Route } from 'react-router-dom'
import store from './redux/store'
import Index from './pages/index'
import routes from './routers/index'
import Menu from './components/menu'
import NoMatch from './pages/noMatch'
import LoadableComponent from './routers/loadable'

// import getRouter from './router/router';
// import './app.scss';

class App extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Menu />
          {routes.map(({ path, exact, file, component }, index) => (
            <Route
              key={index}
              path={path}
              exact={exact}
              component={LoadableComponent(file)}
            />
          ))}
          {/* <Route component={NoMatch} /> */}
        </Router>
      </Provider>
    )
  }
}
export default hot(App)
