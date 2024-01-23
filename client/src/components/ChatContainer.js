import MatchesDisplay from "./MatchesDisplay"
import ChatDisplay from "./ChatDisplay"
import ChatHeader from "./ChatHeader"
import { useState } from "react"


const ChatContainer = ({ user }) => {
  const [clickedMatch, setClickedMatch] = useState(null)

  return (
    <div className="chat-container">
      <ChatHeader user={user}/>
      <div>
        <button className="option" onClick={() => setClickedMatch(null)}>Matches</button>
        <button className="option" disabled={!clickedMatch}>Messages</button>
      </div>

      {!clickedMatch && <MatchesDisplay matches={user.matches} setClickedMatch={setClickedMatch}/>}
      {clickedMatch && <ChatDisplay user={user} clickedMatch={clickedMatch}/>}
    </div>
  )
}

export default ChatContainer