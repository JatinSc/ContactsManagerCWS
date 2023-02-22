import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Home = () => {
  
  // # user can't access homepage without login
  const navigate = useNavigate()
  const {user} = useContext(AuthContext)
  // # we are importing user from AuthContext (we have save the state of user in that )
  useEffect(() => {
     !user && navigate('/login', {replace:true})
  },[])
  return (
  <><div className="jumbotron">
  <h1>Welcome {user ? user.name : null}</h1>
  <hr className="my-4"/>
  <p className="lead">
    <Link to={'/create'}>
    <button className="btn btn-info" href="#" type='button'>Add Contacts</button>
    </Link>
    
  </p>
</div>
</>
  )
}

export default Home