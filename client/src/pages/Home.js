import Nav from "../components/Nav"
import AuthModal from "../components/AuthForm"
import { useState } from "react"

const Home = () => {
  const [showModal, setShowModal] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)
  const authToken = false

  const handleClick = () => {
    console.log("clicked")
    setShowModal(true)
    setHasSigned(true)
  }

  return (
    <div className="overlay">
      <Nav setShowModal={setShowModal} showModal={showModal} setHasSigned={setHasSigned}/>
      <div className="home">
        <h1>Swipe!</h1>
        <button className="primary-button" onClick={handleClick}>
          {authToken ? "Sign out" : "Create Account"}
        </button>
        {showModal && <AuthModal setShowModal={setShowModal} hasSigned={hasSigned} />}
      </div>
    </div>
  )
}

export default Home
