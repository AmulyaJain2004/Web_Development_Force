import React, { useContext } from 'react'
import {useUserAuth} from '../../context/UserAuthContext'
import {UserContext} from '../../context/UserContext'
import DashboardLayout from '../../components/layouts/DashboardLayout'

const Dashboard = () => {
  useUserAuth();
  const {user} = useContext(UserContext);

  return (
    <DashboardLayout>Dashboard</DashboardLayout>
  )
}

export default Dashboard