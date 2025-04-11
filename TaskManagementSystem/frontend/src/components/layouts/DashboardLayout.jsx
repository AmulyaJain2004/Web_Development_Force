import React, {useContext} from 'react'
import Navbar from './Navbar'
import SideMenu from './SideMenu'
import {UserContext} from '../../context/userContext.jsx'

const DashboardLayout = ({children, activeMenu}) => {
  const {user} = useContext(UserContext)
  return (
    <div className="">
      <Navbar activeMenu={activeMenu}/>

      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu}/>
          </div>

          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  )

}

export default DashboardLayout