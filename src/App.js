import React from 'react'
import { Route } from 'react-router-dom'
import Home from './Home'
import Profile from './Profile'
import Callback from './Callback'
import Nav from './Nav'
import Auth from './Auth/Auth'

const App = props => {
  const auth = new Auth(props.history)

  return (
    <>
      <Nav />
      <div className="body">
        <Route
          path="/"
          exact
          render={props => <Home auth={auth} {...props} />}
        />
        <Route
          path="/callback"
          render={props => <Callback auth={auth} {...props} />}
        />
        <Route path="/profile" component={Profile} />
      </div>
    </>
  )
}

export default App
