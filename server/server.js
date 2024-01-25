// Load .environment variables
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


// Route to get users by gender
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

// New user registeration route
app.post('/register', async (req, res) => {
  const { email, password } = req.body
  const client = new MongoClient(uri)
  
  // uuidv4 generates a random user id
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

    // Remove whitespaces and make the email lowercase - to avoid issues such as duplication
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

// Login route, returns a token and the user id
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

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.hashed_password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials"})
    }

    const token = jwt.sign(existingUser, email, {
      expiresIn: '1h'
    })

    // Send the token and the user id as response
    res.status(201).json({ token, user_id: existingUser.user_id })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong"})
  }
})

// Update user route, used after the initial email & password registeration to gather more data
// gender_interest, gender_identity, dob_day, dob_month, dob_year, first_name, last_name, url, about
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

    // Update the user with the new data
    const updatedUser = await users.updateOne({ user_id: data.user_id }, { $set: { ...data } })
    res.status(201).json({ message: "User updated" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong"})
  } finally {
    await client.close()
  } 
})

// GET Route to get user data by user id
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

// After swiping right on a user, add the matched user to the matches array of logged in user
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

// GET Route to get logged in user matches
app.get('/users', async (req, res) => {
  const client = new MongoClient(uri)
  const userIds = JSON.parse(req.query.userIds)

  try {
      await client.connect()
      const database = client.db('app-data')
      const users = database.collection('users')

      // returns users where the user_id is in the userIds array
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

// GET Route to get messages between two users
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

// POST Route to send a message
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

// POST Route to delete a user (only used for Cypress testing)
// If in production, this route should be removed or require admin authorization!
app.post('/deleteUser', async (req, res) => {
  console.log("Account to delete:", req.body)
  const { email } = req.body
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const deletedUser = await users.deleteOne({ email })
    res.status(201).json({ message: "User deleted" })
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