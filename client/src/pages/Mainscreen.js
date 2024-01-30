import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import Card from 'react-tinder-card'
import ChatContainer from '../components/ChatContainer'
import axios from 'axios'


const Mainscreen = () => {
  const [user, setUser] = useState(null)
  const [usersGendered, setUsersGendered] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [alreadySwiped, setAlreadySwiped] = useState([])

  const userId = cookies.UserId
  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:3001/user', {
        params: { userId }
      }) 
      setUser(response.data)

    } catch (err) {
      console.log(err)
    }
  }

  // get users based on logged in user gender interest
  const getUsersGendered = async () => {
    try {
      const response = await axios.get('http://localhost:3001/gendered-users', {
        params: { gender: user?.gender_interest }
      }) 
      setUsersGendered(response.data)

    } catch (err) {
      console.log(err)
    }
  }

  // prevents getUsersGendered running first if user is null
  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (user) {
        getUsersGendered()
    }
  }, [user])
  
  const updatedMatches = async (swipedUser) => {
    try {
      const response = await axios.put('http://localhost:3001/addmatch', {
        userId,
        swipedUser
      })
      getUser()
    } catch (err) {
      console.log(err)
    }
  }


  const [lastDirection, setLastDirection] = useState()

  const swiped = (direction, swipedUser) => {
    setAlreadySwiped([...alreadySwiped, swipedUser])
    if (direction === 'right') {
      updatedMatches(swipedUser)
      getUser()
    }
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  // filter already matched users
  const filteredUsersByGender = usersGendered?.filter(genderedUser => !user.matches.includes(genderedUser.user_id))
  // filter out users that have already swiped on current user
  const alreadySwipedUsers = filteredUsersByGender?.filter(genderedUser => !alreadySwiped.includes(genderedUser.user_id))
  // filter out current user
  const filteredUserAndGender = alreadySwipedUsers?.filter(genderedUser => genderedUser.user_id !== userId)

  console.log(alreadySwiped)
  if (!user || !filteredUsersByGender || !usersGendered) {
    return <div>Loading...</div>
  }

  console.log(filteredUserAndGender)
  // if there are no users to swipe, display "No more users to swipe"
  if (filteredUserAndGender.length === 0) {
    return (
      <div className="mainscreen">
        <ChatContainer user={user}/>
        <div className="swipe-container">
            <h2>No more users to swipe</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="mainscreen">
      <ChatContainer user={user}/>
        <div className="swipe-container">
        {filteredUserAndGender?.map((character, _index) =>
          <Card 
          key={_index} 
          className='swipe'
          onSwipe={(dir) => swiped(dir, character.user_id)} 
          onCardLeftScreen={() => outOfFrame(character.first_name)}
          >
            <div key={character.user_id}style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
            </div>
            <div className='card-info'>
              <h4>{character.first_name}</h4>
              <p>{character.about}</p>
            </div>
          </Card>
        )}
        </div>
      </div>
  )
}

export default Mainscreen