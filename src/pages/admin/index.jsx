import 'stylus/admin'

import Home from './home'
import { inject, Provider, observer } from 'mobx-react'
import adminStore from '../../stores/admin'
//lib
import React, { Component } from 'react';



const store={
  adminStore
}




class Admin extends Component {

  render() {
    return (
      <Provider {...store}>
        <Home></Home>
      </Provider>
    )
  }
}

export default Admin;