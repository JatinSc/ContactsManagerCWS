import React from 'react'

const Spinner = ({splash ="Loading....."}) => {
  return (
    <>
    <div className="text-center mt-5">
    <button className="btn btn-primary" type="button" disabled>
  <span className="spinner-border spinner-border-sm "  role="status" aria-hidden="true" style={{marginRight:"10px",}}></span>
{splash}
</button>
</div>
   
    </>
  )
}

export default Spinner