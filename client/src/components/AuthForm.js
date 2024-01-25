import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import axios from "axios"


const AuthModal = ({ setShowModal, hasSigned }) => {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [error, setError] = useState(null)
  const [cookie, setCookie, removeCookie] = useCookies(['user'])

  let navigate = useNavigate()

  const handleClick = () => {
    setShowModal(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let response;
      if (hasSigned) {
        response = await axios.post('http://localhost:3001/register', {
        email,
        password
      })
      } else {
        response = await axios.post('http://localhost:3001/login', {
          email,
          password
        })
      }
      setCookie('AuthToken', response.data.token)
      setCookie('UserId', response.data.user_id)
      
      if(response.status === 201 && hasSigned) {
        navigate('/welcome')
      }
      if(response.status === 201 && !hasSigned) {
        navigate('/mainscreen')
      }
      window.location.reload() // reload the page to get the cookies

    } catch (err) {
      console.log(err)
      setError(err.response.data.message)
    }
  }

  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={handleClick}>❌</div>
      <h2> {hasSigned ? "Create account" : "Log in"} </h2>
      <form onSubmit={handleSubmit}>
        <input type="email" id="email" placeholder="email" required={true} onChange={(e) => setEmail(e.target.value)}/>
        <br/>
        <input type="password" id="password" placeholder="password" required={true} onChange={(e) => setPassword(e.target.value)}/>
        <p>{error}</p>
        <input className="secondary-button"type="submit" value={hasSigned ? "Create account" : "Log in"} />
      </form>

    </div>
  )
}

export default AuthModal