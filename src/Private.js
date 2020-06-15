import React, { useState, useEffect } from 'react'
import Spinner from './Common/Spinner'

const Private = props => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/private', {
      headers: { Authorization: `Bearer ${props.auth.getAccessToken()}` },
    })
      .then(response => {
        if (response.ok) return response.json()
        throw new Error('Network response was not ok')
      })
      .then(response => setMessage(response.message))
      .catch(error => {
        console.log('error', error)
        setMessage(error.message)
      })
  }, [])

  return message !== '' ? <p>{message}</p> : <Spinner />
}

export default Private
