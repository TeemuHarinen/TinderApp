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
    console.log("Sending request", email, password)
    e.preventDefault()
    try {
      console.log("Post request to database")
      let response;
      if (hasSigned) {
        console.log("Signing up")
        response = await axios.post('http://localhost:3001/register', {
        email,
        password
      })
      } else {
        console.log("Logging in")
        response = await axios.post('http://localhost:3001/login', {
          email,
          password
        })
      }
      console.log(response)
      setCookie('AuthToken', response.data.token)
      setCookie('UserId', response.data.user_id)
      
      if(response.status === 201 && hasSigned) {
        navigate('/welcome')
      }
      if(response.status === 201 && !hasSigned) {
        navigate('/dashboard')
      }

    } catch (err) {
      console.log(err)
      setError(err.message)
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