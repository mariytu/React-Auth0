import React, { useState, useEffect } from 'react'
import Spinner from './Common/Spinner'

const Profile = props => {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = () => {
    props.auth.getProfile((profile, error) => {
      setProfile(profile)
      setError(error)
    })
  }

  return profile ? (
    <>
      <h1>Profile</h1>
      <p>{profile.nickname}</p>
      <img
        style={{ maxWidth: 50, maxHeight: 50 }}
        src={profile.picture}
        alt="profile pic"
      />
      {/* The information available here will vary depending on the identity provider you login with */}
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </>
  ) : (
    <Spinner />
  )
}

export default Profile
