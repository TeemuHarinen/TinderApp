// import image

const Nav = ({ authToken, setShowModal, showModal}) => {
  const handleClick = () => {
    console.log('clicked')
    setShowModal(true)
  }

  return (
    <nav>
      <div className="logo-container">
        <h1 className="logo-text"> Swipe </h1>
      </div>

      {!authToken && <button className="nav-button" onClick={handleClick} disabled={showModal}> Log in </button>}
    </nav>
  )  
}

export default Nav