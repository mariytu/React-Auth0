import React, { useState, useEffect } from 'react'
import Spinner from './Common/Spinner'

const Courses = props => {
  const [message, setMessage] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/course', {
      headers: { Authorization: `Bearer ${props.auth.getAccessToken()}` },
    })
      .then(response => {
        if (response.ok) return response.json()
        throw new Error('Network response was not ok')
      })
      .then(response => {
        setCourses(response.courses)
        setLoading(false)
      })
      .catch(error => {
        console.log('error', error)
        setMessage(error.message)
        setLoading(false)
      })
  }, [])

  return loading ? (
    <Spinner />
  ) : message !== '' ? (
    <p>{message}</p>
  ) : (
    <ul>
      {courses.map(course => (
        <li key={course.id}>{course.title}</li>
      ))}
    </ul>
  )
}

export default Courses
