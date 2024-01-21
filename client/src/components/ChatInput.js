import { useState } from 'react'

const ChatInput = () => {
  const [message, setMessage] = useState(null)
  return (
    <div className="chat-input">
      <textarea value={message} onChange={(e) => setMessage(e.target.value)}/>
      <button className="secondary-button">Send</button>
    </div>
  )
}

export default ChatInput