import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom'
// css
import 'stylus/base'

// blog
import Blog from 'pages/blog'
import Admin from 'pages/admin'

import RouterView from 'pages/routes'


import commonStore from 'stores/blog/common'

class App extends React.Component {
  render() {
    return (
      <Router>
        <RouterView></RouterView>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
