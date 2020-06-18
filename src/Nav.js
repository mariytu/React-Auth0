import React from 'react'
import { Link } from 'react-router-dom'
import AuthContext from './AuthContext'

const Nav = () => {
  return (
    <AuthContext.Consumer>
      {auth => {
        const { isAuthenticated, login, logout, userHasScopes } = auth

        return (
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/public">Public</Link>
              </li>
              {isAuthenticated() && (
                <li>
                  <Link to="/private">Private</Link>
                </li>
              )}
              {isAuthenticated() && userHasScopes(['read:courses']) && (
                <li>
                  <Link to="/courses">Courses</Link>
                </li>
              )}
              {isAuthenticated() && (
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              )}

              <li>
                <button onClick={isAuthenticated() ? logout : login}>
                  {isAuthenticated() ? 'Log Out' : 'Log In'}
                </button>
              </li>
            </ul>
          </nav>
        )
      }}
    </AuthContext.Consumer>
  )
}

export default Nav
