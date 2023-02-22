import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import ToastContext from '../context/ToastContext';

const Login = () => {
const {toast} = useContext(ToastContext)  
const {loginUser} = useContext(AuthContext)
const [credentials , setCredentials] = useState({
    email : "",
    password : "",
  })

  const handleSubmit = (event) => {
   event.preventDefault()
 
   

   //# for using beautiful toast messages
   if(!credentials.email || !credentials.password){
    toast.error("please enter all the fields")
    return;
   }
   
   //# now we will send data to /context/authContext
   loginUser(credentials);

  }

  return (
    <>

    
     <h3>LOGIN</h3>
    <form onSubmit={handleSubmit}>
       <div className="form-group">
      <label htmlFor="emailInput" className="form-label mt-4">
        Email address
        </label>
      <input type="email" 
      className="form-control" 
      id="emailInput"
      name='email'  
      value={credentials.email}
      onChange={(e)=> {setCredentials({...credentials, email: e.target.value})}}
      // required
      placeholder="Enter email"/>
      <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
    </div>

    <div className="form-group">
      <label htmlFor="passwordInput" className="form-label mt-4">
       Password
        </label>
      <input type="password" 
      className="form-control" 
      id="passwordInput" 
      name='password'
      value={credentials.password} 
      onChange={(e)=> {setCredentials({...credentials, password: e.target.value})}}
      // required
      placeholder="Enter password"/>
    </div>
    <input type="submit" value="login" className='btn btn-primary my-3'/>
    <p>Don't have an account ? <Link to="/register">Create One</Link> </p>
    </form>
    </>
   
  )
}

export default Login