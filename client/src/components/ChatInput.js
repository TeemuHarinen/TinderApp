import { useState } from 'react'
import axios from 'axios'


const ChatInput = ({ user, clickedUser, getMessages }) => {
  const [textArea, setTextArea] = useState("")

  const addMsg = async () => {
    try {
      const response = await axios.post('http://localhost:3001/messages', {
        timestamp: new Date().toISOString(),
        from_userId: user?.user_id,
        to_userId: clickedUser?.user_id,
        message: textArea
      })

      getMessages()
      setTextArea('')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="chat-input">
      <textarea value={textArea} onChange={(e) => setTextArea(e.target.value)}/>
      <button className="secondary-button" onClick={addMsg}>Send</button>
    </div>
  )
}

export default ChatInput