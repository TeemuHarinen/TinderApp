import { useState } from "react"

const AuthModal = ({ setShowModal }) => {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [error, setError] = useState(null)

  console.log(email)
  console.log(password)
  const handleClick = () => {
    console.log('clicked')
    setShowModal(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('submitted')
  }

  const isSigned = true
  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={handleClick}>❌</div>
      <h2> {isSigned ? "Create account" : "Log in"} </h2>
      <form onSubmit={handleSubmit}>
        <input type="email" id="email" placeholder="email" required={true} onChange={(e) => setEmail(e)}/>
        <input type="password" id="password" placeholder="password" required={true} onChange={(e) => setPassword(e)}/>
      </form>
    </div>
  )
}

export default AuthModal