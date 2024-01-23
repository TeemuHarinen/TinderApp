require('dotenv').config()
const PORT = 3001
const uri = process.env.MONGO_URI

const express = require('express');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.get('/gendered-users', async (req, res) => {
  const client = new MongoClient(uri)
  const genderToFind = req.query.gender
  
  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const returnedUsersByGender = await users.find({ gender_identity: genderToFind}).toArray()
    res.send(returnedUsersByGender)
  } finally {
    await client.close()
  }
})

app.post('/register', async (req, res) => {
  const { email, password } = req.body
  const client = new MongoClient(uri)
  
  const generatedUserId = uuidv4()
  const hashedPass = await bcrypt.hash(password, 10)
  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists"})
    }

    const sanitazedEmail = email.toLowerCase().trim()
    const newUser = {
      email: sanitazedEmail,
      hashed_password: hashedPass,
      user_id: generatedUserId,
      matches: []
    }

    const insertedUser = await users.insertOne(newUser)
    const token = jwt.sign(insertedUser, sanitazedEmail, {
      expiresIn: '1h'
    })

    res.status(201).json({ token, user_id: generatedUserId})
    } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong"})
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const existingUser = await users.findOne({ email })
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist"})
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.hashed_password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials"})
    }

    const token = jwt.sign(existingUser, email, {
      expiresIn: '1h'
    })

    res.status(201).json({ token, user_id: existingUser.user_id }) // check this
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong"})
  }
})

app.put('/user', async (req, res) => {
  const data = req.body.data
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const user = await users.findOne({ user_id: data.user_id })
    if (!user) {
      return res.status(400).json({ message: "User does not exist"})
    }

    const updatedUser = await users.updateOne({ user_id: data.user_id }, { $set: { ...data } })
    res.status(201).json({ message: "User updated" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong"})
  } finally {
    await client.close()
  } 
})

app.get('/user', async (req, res) => {
  const userId = req.query.userId
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const user = await users.findOne({ user_id: userId })
    if (!user) {
      return res.status(400).json({ message: "User does not exist"})
    }

    res.status(201).json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong"})
  } finally {
    await client.close()
  }
})

app.put('/addmatch', async (req, res) => {
  const { userId, swipedUser } = req.body
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const user = await users.findOne({ user_id: userId })
    if (!user) {
      return res.status(400).json({ message: "User does not exist"})
    }

    const updatedUser = await users.updateOne({ user_id: userId }, { $push: { matches: swipedUser } })
    res.status(201).json({ message: "User updated" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong"})
  } finally {
    await client.close()
  }
})


app.get('/users', async (req, res) => {
  const client = new MongoClient(uri)
  const userIds = JSON.parse(req.query.userIds)

  try {
      await client.connect()
      const database = client.db('app-data')
      const users = database.collection('users')

      const pipeline =
          [
              {
                  '$match': {
                      'user_id': {
                          '$in': userIds
                      }
                  }
              }
          ]

      const foundUsers = await users.aggregate(pipeline).toArray()
      res.json(foundUsers)

  } finally {
      await client.close()
  }
})

app.get('/messages', async (req, res) => {
  const { userId, matchedUserId } = req.query
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const database = client.db('app-data')
    const messages = database.collection('messages')

    // returns messages where the user is either the sender or the receiver
    const returnedMessages = await messages.find({ $or: [{ from_userId: userId, to_userId: matchedUserId }, { from_userId: matchedUserId, to_userId: userId }] }).toArray()
    res.send(returnedMessages)
  } finally {
    await client.close()
  }
})

app.post('/messages', async (req, res) => {
  const { timestamp, from_userId, to_userId, message } = req.body
  const client = new MongoClient(uri)

  if (!timestamp || !from_userId || !to_userId || !message) {
    return res.status(400).json({ message: "Missing message data"})
  }

  
  try {
    await client.connect()
    const database = client.db('app-data')
    const messages = database.collection('messages')

    const newMessage = {
      timestamp,
      from_userId,
      to_userId,
      message
    }

    const insertedMessage = await messages.insertOne(newMessage)
    res.status(201).json({ message: "Message sent" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong"})
  } finally {
    await client.close()
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})