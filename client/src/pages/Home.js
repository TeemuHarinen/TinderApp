import Nav from "../components/Nav"
import AuthModal from "../components/AuthForm"
import { useState } from "react"
import { useCookies } from "react-cookie"

const Home = () => {
  const [showModal, setShowModal] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const authToken = cookies.AuthToken

  const handleClick = () => {
    if (authToken) {
      removeCookie('UserId', cookies.UserId)
      removeCookie('AuthToken', cookies.AuthToken)
      window.location.reload()
      return 
    }
    setShowModal(true)
    setHasSigned(true)
  }

  return (
    <div className="overlay">
      <Nav authToken={authToken} setShowModal={setShowModal} showModal={showModal} setHasSigned={setHasSigned}/>
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
