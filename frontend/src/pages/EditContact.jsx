import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import ToastContext from '../context/ToastContext'
import Spinner from '../components/Spinner';

const EditContact = () => {
  //# use params is used to get id from parameters
  const { id } = useParams();
  const { toast } = useContext(ToastContext)
  const { user } = useContext(AuthContext)

  const [loading, setLoading] = useState()
  const navigate = useNavigate()
  const [contactDetails, setContactDetails] = useState({
    name: "",
    address: "",
    email: "",
    phone: ""
  })




  //# for sending the data from frontend to backend
  const handleSubmit = async (event) => {
    event.preventDefault()

    const res = await fetch(`https://contactmanagerbackend-d7sm.onrender.com/contact`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({id ,...contactDetails})
    });
    const result = await res.json();
    if (!result.error) {
      toast.success(`contact updated successfully`)
      setContactDetails({ name: "", address: "", email: "", phone: "" })
      setTimeout(()=>{
        navigate("/mycontact")
      },2000)
      
    } else {
      toast.error(result.error);
    }
  }

  // # for getting the details of selected contact to edit 
  useEffect(async () => {
    setLoading(true)
    try {
      const res = await fetch(`https://contactmanagerbackend-d7sm.onrender.com/contact/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      });
      const result = await res.json()
      // # for getting the selected values in input fields,
      // # after that updating the state with new values
      setContactDetails({ 
        name: result.name,
        address: result.address, 
        email: result.email,
        phone: result.phone 
      });
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      {loading ? <Spinner splash='Loading Contacts......' /> : (<>
        <h2>Edit your Contact</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nameInput" className="form-label mt-4">
              Edit Name
            </label>
            <input type="text"
              className="form-control"
              id="nameInput"
              name='name'
              value={contactDetails.name}
              onChange={(e) => { setContactDetails({ ...contactDetails, name: e.target.value }) }}
              // required
              placeholder="Jatin singh" />
          </div>

          <div className="form-group">
            <label htmlFor="addressInput" className="form-label mt-4">
              Edit Address
            </label>
            <input type="text"
              className="form-control"
              id="addressInput"
              name='address'
              value={contactDetails.address}
              onChange={(e) => { setContactDetails({ ...contactDetails, address: e.target.value }) }}
              // required
              placeholder="WalkStreet 05 , California" />
          </div>

          <div className="form-group">
            <label htmlFor="emailInput" className="form-label mt-4">
              Edit email
            </label>
            <input type="email"
              className="form-control"
              id="emailInput"
              name='email'
              value={contactDetails.email}
              onChange={(e) => { setContactDetails({ ...contactDetails, email: e.target.value }) }}
              // required
              placeholder="Jatinsingh@example.com" />
          </div>

          <div className="form-group">
            <label htmlFor="phoneInput" className="form-label mt-4 ">
              Edit Number
            </label>
            <input type="number"
              className="form-control mb-3"
              id="phoneInput"
              name='phone'
              value={contactDetails.phone}
              onChange={(e) => { setContactDetails({ ...contactDetails, phone: e.target.value }) }}
              // required
              placeholder="+91 7979927488" />
          </div>
          <input type="submit" value="Save Changes" className="btn btn-primary my-2" />
          <a className='btn btn-warning my-2 mx-2' href='/mycontact'>Cancel</a>
        </form>
      </>)}

    </>
  )
}

export default EditContact