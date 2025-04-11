import React, { use } from 'react'
import {useUserAuth} from '../../context/UserAuthContext'

const UserDashboard = () => {
  useUserAuth();
  return (
    <div>UserDashboard</div>
  )
}

export default UserDashboard;