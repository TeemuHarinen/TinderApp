import ChatInput from "./ChatInput"
import Chat from "./Chat"
import axios from "axios"
import { useState, useEffect } from "react"

const ChatDisplay = ({ user, clickedMatch }) => {
  const [messages, setMessages] = useState(null)

  // gets all messages between the user and the clicked match
  const getUsersMsg = async () => {
    try {
      const response = await axios.get('http://localhost:3001/messages', {
        params: { userId: user?.user_id, matchedUserId: clickedMatch?.user_id }
      }) 
      setMessages(response.data)

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUsersMsg()
  }, [])

  // format messages to display in chat
  const formatMessages = () => {
    let formattedMessages = []
    messages?.forEach(message => {
      if (message.from_userId === user?.user_id) {
        formattedMessages.push({ sender: user?.first_name, message: message.message, timestamp: message.timestampl, sender_img: user?.url })
      } else {
        formattedMessages.push({ sender: clickedMatch?.first_name, message: message.message, timestamp: message.timestamp, sender_img: clickedMatch?.url })
      }
    })
    // sort messages by timestamp
    formattedMessages.sort((a, b) => {
      return new Date(a.timestamp) - new Date(b.timestamp)
    })
    return formattedMessages
  }

  const lastMessage = messages?.[messages.length - 1]
  const formattedMessages = formatMessages(messages)

  return (
    <>
    <Chat messages={formattedMessages} lastEdited={lastMessage}/>
    <ChatInput user={user} clickedUser={clickedMatch} getMessages={getUsersMsg}/>
    </>
  )
}

export default ChatDisplay