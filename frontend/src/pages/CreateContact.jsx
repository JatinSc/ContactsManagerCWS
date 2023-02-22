import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import ToastContext from '../context/ToastContext'

const CreateContact = () => {
    const {toast} = useContext(ToastContext)
    const {user} = useContext(AuthContext)

    const [contactDetails , setContactDetails] = useState({
        name : "",
        address : "",
        email : "",
        phone : ""
    })

    const navigate = useNavigate()
    
    

    //# for sending the data from frontend to backend
    const handleSubmit = async (event) =>{
      event.preventDefault()  

      const res = await fetch(`https://contactmanagerbackend-d7sm.onrender.com/contact`, {
        method : "POST",
        headers : {
            "Content-type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body : JSON.stringify(contactDetails)
    });
    const result = await res.json();
    if(!result.error){
        toast.success(`contact named "${contactDetails.name}" saved successfully`)
        setContactDetails({name:"",address:"",email:"",phone:""})
    }else{
        toast.error(result.error);
    }
    }
  return (
    <>
    <h2>Create your Contact</h2>

    <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="nameInput" className="form-label mt-4">
        Add Name
        </label>
      <input type="text" 
      className="form-control" 
      id="nameInput"
      name='name'  
      value={contactDetails.name}
      onChange={(e)=> {setContactDetails({...contactDetails, name: e.target.value})}}
      // required
      placeholder="Jatin singh"/>
    </div>

    <div className="form-group">
      <label htmlFor="addressInput" className="form-label mt-4">
        Add Address
        </label>
      <input type="text" 
      className="form-control" 
      id="addressInput"
      name='address'  
      value={contactDetails.address}
      onChange={(e)=> {setContactDetails({...contactDetails, address: e.target.value})}}
      // required
      placeholder="WalkStreet 05 , California"/>
    </div>

    <div className="form-group">
      <label htmlFor="emailInput" className="form-label mt-4">
        Add email
        </label>
      <input type="email" 
      className="form-control" 
      id="emailInput"
      name='email'  
      value={contactDetails.email}
      onChange={(e)=> {setContactDetails({...contactDetails, email: e.target.value})}}
      // required
      placeholder="Jatinsingh@example.com"/>
    </div>

    <div className="form-group">
      <label htmlFor="phoneInput" className="form-label mt-4 ">
        Add Number
        </label>
      <input type="number" 
      className="form-control mb-3" 
      id="phoneInput"
      name='phone'  
      value={contactDetails.phone}
      onChange={(e)=> {setContactDetails({...contactDetails, phone: e.target.value})}}
      // required
      placeholder="+91 7979927488"/>
    </div>
    <input type="submit" value="Add Contact" className="btn btn-info my-2" />
    
    </form>
    </>
  )
}

export default CreateContact