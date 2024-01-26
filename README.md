# TinderApp

Tinder clone created with MERN-stack (MongoDB, Express.js, React.js, Node.js).

Features:
   - Swipe users just like in Tinder
     
   - Matched users show up on page
     
   - Immidiately chat live with matched user
     
   - Secure authorization with JWT tokens
     
   - Users can login, create new accounts, modify own user data, preferences etc.
     
     
## Backend


   o	Relevant libraries:
   
      	Runs on Node.js
      
      	Express package used for server hosting and routing
      
      	Bcrypt used to hash password
      
      	Dotenv for secure environment vars
      
      	JWT for authorization
      
      	MongoDB as backend, connects directly without mongoose
      
      	Uuid for id generation, MongoDB object id not used.
      

## Frontend
   o	Created with React.js
   
   o	Relevant libraries:
   
      	Axios for HTTP requests
      
      	React-cookie for storing cookies from server, includes UserId and AuthToken
      
      	React-tinder-card for swiping users
      
      	React router for easy page manipulation
      
      o	Responsive design implemented with media querries, had trouble with Materialize so went with this approach instead (and because ChatGPT was surprisingly good at creating viable media queries)

## Installation

   - Fork the project from GitHub https://github.com/TeemuHarinen/TinderApp

   - The full stack application is divided into two parts, client and server. Each needs to be started individually:

## Starting the server:

   a)	Navigate to the server folder

   b)	Run `npm install` to install dependencies

   c)	Set up environment variables. Create a .env file inside server folder with the following variable: `MONGO_URI: ”Connection string for MongoDB database”`

   d)	All done! Server should be able to start with `npm run start:server`, or to start without nodemon run `npm start`

   e)	(You can confirm that the server is correctly responding by visiting localhost:3001, you should see “Hello World!” on the screen.)


## Starting the client:
   
   a)	After starting the server in part 3.

   b)	Navigate to the client folder

   c)	Run `npm install` to install dependencies

   d)	Run `npm start` to start React development client

   e)	Navigate to localhost:3000 and you should see the registeration/login page



## Registeration page
![RegisterationPage](https://github.com/TeemuHarinen/TinderApp/blob/c14f2d9b0fcb5923fcc88e0c3816876883c150bb/pictures/SCR-20240126-nhdc.png)

## Authentication/Registeration
![PictureOfAuthForm](https://github.com/TeemuHarinen/TinderApp/blob/5990d1c32450d2ddcf3aa0631d20ea5bba3df49c/pictures/SCR-20240126-nigw.png)

## Registeration form
![PictureOfRegisterationForm](https://github.com/TeemuHarinen/TinderApp/blob/2264a37216de903e8ec72bb74d404ec53562bd82/pictures/SCR-20240126-nitv.png)

## Home screen/Matches display
![PictureOfDetailsForm](https://github.com/TeemuHarinen/TinderApp/blob/5990d1c32450d2ddcf3aa0631d20ea5bba3df49c/pictures/SCR-20240126-njda.jpeg)

## Chatting
![PictureWithChat](https://github.com/TeemuHarinen/TinderApp/blob/a88e6b15c423fd8e2e38a0fab8fc1041de62bad2/pictures/SCR-20240126-njvg.png)
