import React from 'react'
import { Provider } from 'mobx-react'
import { Route } from 'react-router-dom'
// css
import 'stylus/base'
// comp
import NavBarTop from 'components/blog/top-nav'
import Footer from 'components/blog/footer'
import commonStore from 'stores/blog/common'

import Home from './home'
import Article from './article'

const stores = {
  commonStore
}

export default class Blog extends React.Component {
  render() {
    return (
      <Provider {...stores}>
        <div>
          <NavBarTop></NavBarTop>
          <Route path='/blog' exact component={Home} ></Route>
          <Route path='/blog/article/:id' component={Article} ></Route>
          <Footer></Footer>
        </div>
      </Provider>
    )
  }
}

