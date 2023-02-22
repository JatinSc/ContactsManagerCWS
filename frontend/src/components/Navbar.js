import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import ToastContext from '../context/ToastContext'
const Navbar = ({ title = "Contacts Manager" }) => {
  const { user, setUser } = useContext(AuthContext)

  const { toast } = useContext(ToastContext)
  const navigate = useNavigate()

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link to="/">
            <a className="navbar-brand"><strong>{title}</strong></a>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav ms-auto">
              {user ? <>
                <li className="nav-item">
                <Link to="/create">
                  <a className="nav-link"><strong>Create </strong></a>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/mycontact">
                  <a className="nav-link"><strong>All Contacts </strong></a>
                </Link>
              </li>
              <li className="nav-item">
                <button className='btn btn-danger'
                  onClick={() => {
                    setUser(null)
                    localStorage.clear()
                    toast.success('Logged out')
                    navigate('/login', { replace: true })
                  }}>Logout</button>
              </li></> : <> <li className="nav-item">
                <Link to="/login">
                  <a className="nav-link">LOGIN </a>
                </Link>
                {/* <span class="visually-hidden">(current)</span> */}
              </li>
                <li className="nav-item">
                  <Link to="/register">
                    <a className="nav-link">REGISTER</a>
                  </Link>
                </li></>}
            </ul>

          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar