import React, { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Home from './Home'
import Profile from './Profile'
import Callback from './Callback'
import Nav from './Nav'
import Auth from './Auth/Auth'
import Public from './Public'
import Private from './Private'
import Courses from './Courses'
import Admin from './Admin'
import PrivateRoute from './PrivateRoute'
import AuthContext from './AuthContext'
import Spinner from './Common/Spinner'

const App = props => {
  const [auth, setAuth] = useState(new Auth(props.history))
  const [tokenRenewalComplete, setTokenRenewalComplete] = useState(false)

  useEffect(() => {
    auth.renewToken(() => setTokenRenewalComplete(true))
  }, [])

  return !tokenRenewalComplete ? (
    <Spinner />
  ) : (
    <AuthContext.Provider value={auth}>
      <Nav />
      <div className="body">
        <Route path="/" exact render={props => <Home {...props} />} />
        <Route
          path="/callback"
          render={props => <Callback auth={auth} {...props} />}
        />
        <PrivateRoute path="/profile" component={Profile} />
        <Route path="/public" component={Public} />
        <PrivateRoute path="/private" component={Private} />
        <PrivateRoute
          path="/courses"
          component={Courses}
          scopes={['read:courses']}
        />
        <PrivateRoute path="/admin" component={Admin} />
      </div>
    </AuthContext.Provider>
  )
}

export default App
