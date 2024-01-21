import { useState } from 'react'
import Card from 'react-tinder-card'
import ChatContainer from '../components/ChatContainer'

const Dashboard = () => {
  const db = [
    {
      name: 'Richard Hendricks',
      url: 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    {
      name: 'Erlich Bachman',
      url: './img/erlich.jpg'
    },
    {
      name: 'Monica Hall',
      url: './img/monica.jpg'
    },
    {
      name: 'Jared Dunn',
      url: './img/jared.jpg'
    },
    {
      name: 'Dinesh Chugtai',
      url: './img/dinesh.jpg'
    }
  ]
  const characters = db
  const [lastDirection, setLastDirection] = useState()

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  return (
    <div className="mainscreen">
      <ChatContainer />
      <div className="swiper-container">
        <div className="card-container">
        {characters.map((character) =>
          <Card 
          className='swipe'
          key={character.name} 
          onSwipe={(dir) => swiped(dir, character.name)} 
          onCardLeftScreen={() => outOfFrame(character.name)}
          >
            <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
              <h3>{character.name}</h3>
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

export default Dashboard