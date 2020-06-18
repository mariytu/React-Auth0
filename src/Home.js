import React from 'react'
import { Link } from 'react-router-dom'
import AuthContext from './AuthContext'

const Home = () => {
  return (
    <AuthContext.Consumer>
      {auth => {
        const { isAuthenticated, login } = auth
        return (
          <>
            <h1>Home</h1>
            {isAuthenticated() ? (
              <Link to="/profile">View Profile</Link>
            ) : (
              <button onClick={login}>Log In</button>
            )}
          </>
        )
      }}
    </AuthContext.Consumer>
  )
}

export default Home
