const Chat = ({ messages, lastEdited }) => {

  if (!messages || !lastEdited) return <>Loading...</>

  const date = new Date(lastEdited.timestamp)
  const dateString = date.toLocaleDateString()
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="chat-display">
      <h2> Chat </h2>
      {messages?.map((message, _index) => (
        <div key={_index}>
          <div className="chat-message-header">
            <h4>{message.sender}</h4>
            <img src={message.sender_img} className="img-container" alt="chat_profile"></img>
            <p>{message.message}</p>
          </div>
        </div>
      ))}
      <h6> Last edited {dateString} {timeString} </h6>
    </div>
  )
}

export default Chat