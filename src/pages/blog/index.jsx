import React from 'react'
import { Provider } from 'mobx-react'
import { Route } from 'react-router-dom'
// css
import 'stylus/base'
// comp
import NavBarTop from 'components/blog/top-nav'
import Footer from 'components/blog/footer'
import commonStore from 'stores/blog/common'

import Message from './message'
import Home from './home'
import Article from './article'
import Category from './category'
import About from './about'
const stores = {
  commonStore
}

export default class Blog extends React.Component {
  render() {
    return (
      <Provider {...stores}>
        <div className="blog-body">
          <NavBarTop></NavBarTop>
          <Route path='/blog' exact component={Home} ></Route>
          <Route path='/blog/article/:id' component={Article} ></Route>
          <Route path='/blog/category/:id' component={Category} ></Route>
          <Route path='/blog/message' component={Message} ></Route>
          <Route path='/blog/about' component={About} ></Route>
          <Footer></Footer>
        </div>
      </Provider>
    )
  }
}

