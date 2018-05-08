import React, { Component } from 'react'
import { Route,Redirect,Switch } from 'react-router-dom'
import 'stylus/admin'

import Home from './home'
import adminStore from '../../stores/admin'
import { Provider } from 'mobx-react'
import Login from './login'

//lib



class Admin extends Component {

  render() {
    return (
      <div style={{height:'100%'}}>
        <Route path='/admin' exact render={()=> <Redirect to="/admin/login" />} />
        <Route path='/admin/login' component={Login} />
        <Provider adminStore={adminStore}>
         <Route path='/admin/home' component={Home} />
        </Provider>
      </div>
    )
  }
}

export default Admin;