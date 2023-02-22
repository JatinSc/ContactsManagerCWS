import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../context/AuthContext';
import ToastContext from '../context/ToastContext';


const Register = () => {
  
  const {toast} = useContext(ToastContext);
  
  const {registerUser} = useContext(AuthContext)
  const [credentials , setCredentials] = useState({
    name:"",
    email : "",
    password : "",
    confirmPassword : "",
  })

  const handleSubmit = (event) => {
    event.preventDefault()

    //# for using beautiful-toast messages for any error
    if(!credentials.email || !credentials.password || !credentials.confirmPassword){
      toast.error("please enter all the fields")
      return;
     }
     if(credentials.password !== credentials.confirmPassword){
      toast.error("password doesn't match")
      return;
     }
     const userData = {...credentials,confirmPassword:undefined}
    //# now we will send data to /context/authContext
     registerUser(userData)
   }

  return (
    <>
    {/* <ToastContainer autoClose={3000}/> */}
    <div className='wrap'>
    <h3>Create Your Account</h3>
    <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="nameInput" className="form-label mt-4">
       Name
        </label>
      <input type="text" 
      className="form-control" 
      id="nameInput"
      name='name'
      value={credentials.name}
      onChange={(e)=> {setCredentials({...credentials, name: e.target.value})}}
      // required
      placeholder="Enter name"/>
    </div>
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
    <div className="form-group">
      <label htmlFor="confirmPassword" className="form-label mt-4">
      Confirm Password
        </label>
      <input type="password" 
      className="form-control" 
      id="confirmPassword" 
      name='confirmPassword' 
      value={credentials.confirmPassword}
      onChange={(e)=> {setCredentials({...credentials, confirmPassword: e.target.value})}}
      // required
      placeholder="Enter password"/>
    </div>
    <input type="submit" value="Register" className='btn btn-primary my-3'/>
    <p>Already have an account ? <Link to="/login">Login</Link> </p>
    </form>
    </div>
   
    </>
  )
}

export default Register