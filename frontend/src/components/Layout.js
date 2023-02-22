import React from 'react'
import Navbar from './Navbar'

const Layout = ({navbar = true , children}) => {
  return (
    <>
   {/* // #  we will only render when its true */}
   {navbar && <Navbar/>}
    <div className='container mt-3'>{children}</div>
    </>
  )
}

export default Layout