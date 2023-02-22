import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner';
import Modal from 'react-bootstrap/Modal';
import ToastContext from '../context/ToastContext';


const AllContact = () => {
  const { toast } = useContext(ToastContext)
  //# for editing , deleting contacts we used modal
  const [showModal, setShowModal] = useState(false)
  //# for fetching selected data we used created state
  const [modalData, setModalData] = useState({})
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("")
  // const [searchedContact,setSearchedContact] = useState()
  
  const getContact = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://contactmanagerbackend-d7sm.onrender.com/mycontact`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });


      const result = await res.json();

      if (!result.error) {
        setContacts(result.contacts)
        setLoading(false)
      } else {
        console.log(result.error)
        setLoading(false);
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getContact()
  }, []);

  const deleteContact = async (id) => {
    //# confirm method is used to reconfirm the deletion of a contact
    if (window.confirm("Are you sure you want to delete this contact ?")) {
      try {
        const res = await fetch(`https://contactmanagerbackend-d7sm.onrender.com/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await res.json();
        if (!result.error) {
          //# we have made myContacts as updated contact in backend rotes/contact/ delete route 
          //# now we will update state with new updated contacts
          setContacts(result.myContacts)
          toast.success(`contact deleted successfully`)
          setShowModal(false);
        } else {
          console.log(result.error)
        }
      } catch (error) {
        toast.error(error);
      }
    }
  };

  //# for handling the search functionality
  const handleSearchInput = (event) => {
    event.preventDefault()
    if (searchInput.length === 0) {
      toast.error(`No search input`)
      return
    }
    const newSearchContact = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchInput.toLowerCase()))
    console.log(newSearchContact)
    setContacts(newSearchContact)
  }



  return (
    <><div>
      <h1>Your Contacts</h1>
      <hr className="my-4" />
      {loading ? <Spinner splash='Loading Contacts......' /> : (
        <>{contacts.length == 0 ? <h3>NO CONTACTS CREATED YET </h3> :
          (
            <>
              <form style={{ display: "flex" }} onSubmit={handleSearchInput}>
                <input type="text"
                  name='searchInput'
                  id='searchInput'
                  className='form-control my-3'
                  placeholder='Search Contacts'
                  value={searchInput}
                  onChange={(e) => { setSearchInput(e.target.value) }}
                  style={{color:"#044474"}}
                />
                <button type='submit'
                  className='btn btn-info mx-2 my-3'
                  style={{ height: "40px" }}>
                  Search
                </button>
                <a className='btn btn-warning mx-2 my-3' href='/mycontact' style={{ height: "40px" }}>Reload</a>
              </form>
              <p style={{ color: "#0480FC" }}>Your Total Contacts :<strong> {contacts.length} </strong></p>
              <table className="table table-hover">
                <thead>
                  <tr className="table-primary">
                    <th scope="col">Name</th>
                    <th scope="col">Address</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {/* //# we are directly filtering the contacts here , instead of doing it in the handleInputSearch function */}
                  {contacts.filter((contact) =>
                    contact.name.toLowerCase().includes(searchInput.toLowerCase())).map((contact) => (
                      <tr key={contact._id} className="table-light"
                        onClick={() => {
                          setModalData({});
                          setModalData(contact);
                          setShowModal(true)
                        }}>
                        <th scope="row">{contact.name}</th>
                        <td>{contact.address}</td>
                        <td>{contact.email}</td>
                        <td>{contact.phone}</td>
                      </tr>
                    ))}
                </tbody>
              </table></>)} </>
      )}
    </div>
      <Modal show={showModal} onHide={() => { setShowModal(false) }}>
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>{modalData.name}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <h3>{modalData.name}</h3>
            <p><strong>ADDRESS</strong> : {modalData.address}</p>
            <p><strong>EMAIL</strong> : {modalData.email}</p>
            <p><strong>PHONE</strong> : {modalData.phone}</p>
          </Modal.Body>

          <Modal.Footer>
            <Link to={`/edit/${modalData._id}`} className="btn btn-info">
              EDIT
            </Link>
            <button className="btn btn-warning" onClick={() => setShowModal(false)}>Close</button>
            <button className="btn btn-danger"
              onClick={() => deleteContact(modalData._id)}>
              DELETE
            </button>

          </Modal.Footer>
        </Modal.Dialog>
      </Modal>

    </>
  )
}

export default AllContact