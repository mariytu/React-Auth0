import React from 'react'
import { Link } from 'react-router-dom'

const Home = props => {
  const { isAuthenticated, login } = props.auth
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
}

export default Home
