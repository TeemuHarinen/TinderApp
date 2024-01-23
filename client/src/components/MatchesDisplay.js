import axios from 'axios'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'

const MatchesDisplay = ({ matches, setClickedMatch }) => {
  const [matchedUsers, setMatchedUsers] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  const getMatches = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users', {
        params: { userIds: JSON.stringify(matches) }
      }) 
      setMatchedUsers(response.data)

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getMatches()
  },[])

  const bothHaveMatched = matchedUsers?.filter(matchedProfile => matchedProfile.matches.filter((match) => match === cookies.UserId).length > 0)
  return (
    <div>
    {bothHaveMatched?.map((match) => (
      <div key={match.user_id} className="match-card" onClick={() => setClickedMatch(match)}>
        <div className='img-container'>
          <img src={match.url} alt="matched user pic"></img>
        </div>
        <h4>{match?.first_name}</h4>
      </div>
    ))}
  </div>
  )
}

export default MatchesDisplay