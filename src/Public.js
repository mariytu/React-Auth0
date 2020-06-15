import React, { useState, useEffect } from 'react'
import Spinner from './Common/Spinner'

const Public = () => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/public')
      .then(response => {
        if (response.ok) return response.json()
        throw new Error('Network response was not ok')
      })
      .then(response => setMessage(response.message))
      .catch(error => setMessage(error.message))
  }, [])

  return message !== '' ? <p>{message}</p> : <Spinner />
}

export default Public
