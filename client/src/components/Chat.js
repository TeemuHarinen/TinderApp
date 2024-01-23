const Chat = ({ messages }) => {
  return (
    <div className="chat-display">
      {messages?.map((message, _index) => (
        <div key={_index}>
          <div className="chat-message-header">
            <h4>{message.sender}</h4>
            <p>{message.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Chat