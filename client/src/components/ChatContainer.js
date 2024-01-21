import MatchesDisplay from "./MatchesDisplay"
import ChatDisplay from "./ChatDisplay"
import ChatHeader from "./ChatHeader"

const ChatContainer = () => {
  return (
    <div className="chat-container">
      <ChatHeader/>
      <div>
        <button className="option">Matches</button>
        <button className="option">Messages</button>
      </div>

      <MatchesDisplay/>
      <ChatDisplay/>
    </div>
  )
}

export default ChatContainer