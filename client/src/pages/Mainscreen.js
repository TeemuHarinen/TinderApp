import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import Card from 'react-tinder-card'
import ChatContainer from '../components/ChatContainer'
import axios from 'axios'


const Mainscreen = () => {
  const [user, setUser] = useState(null)
  const [usersGendered, setUsersGendered] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

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
    if (direction === 'right') {
      updatedMatches(swipedUser)
      getUser()
    }

    if (direction === 'left') {

    }
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  const filteredUsersByGender = usersGendered?.filter(genderedUser => !user.matches.includes(genderedUser.user_id))
  


  if (!user || !filteredUsersByGender || !usersGendered) {
    return <div>Loading...</div>
  }

  if (filteredUsersByGender.length === 0) {
    return (
      <div className="mainscreen">
        <ChatContainer user={user}/>
        <div className="swiper-container">
          <div className="card-container">
            <h2>No more users to swipe</h2>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="mainscreen">
      <ChatContainer user={user}/>
      <div className="swiper-container">
        <div className="card-container">
        {filteredUsersByGender.map((character) =>
          <Card 
          className='swipe'
          key={character.user_id} 
          onSwipe={(dir) => swiped(dir, character.user_id)} 
          onCardLeftScreen={() => outOfFrame(character.first_name)}
          >
            <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
              <h3>{character.first_name}</h3>
            </div>
          </Card>
        )}
        <div className="swipe-info">
          <h2>You swiped {lastDirection}</h2>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Mainscreen