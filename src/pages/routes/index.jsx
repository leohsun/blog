import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
// blog

// blog
import Blog from 'pages/blog'


//admin
import Admin from 'pages/admin'



const NoMatch = ()=>{
  return <h2>404</h2>
}

export default function RouterView() {
  return (
    <Switch>
      <Route path='/' exact render={()=><Redirect to='/blog' /> }></Route>
      <Route path='/blog' component={Blog}></Route>
      <Route path='/admin' component={Admin}></Route>
      <Route component={NoMatch}/>
    </Switch>
  )
}