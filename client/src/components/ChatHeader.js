import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

const ChatHeader = ({ user }) => {
  const [ cookies, setCookie, removeCookie ] = useCookies(['user'])

  const navigate = useNavigate()

  const logout = () => {
    removeCookie('UserId', cookies.UserId)
    removeCookie('AuthToken', cookies.AuthToken)
    navigate('/')
  }
  if (!user) return null
  
  const handleClick = () => {
    navigate('/update_profile')
  }
  return (
    <div className="chat-container-header">
      <div className="profile">
        <div className="img-container">
          <img src={user.url} alt="User" onClick={handleClick}/>
        </div>
        <h4>{user.first_name}</h4>
      </div>
      <button className="secondary-button" onClick={logout}>Log out</button>
    </div>
  )
}

export default ChatHeader
