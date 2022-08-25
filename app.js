const express = require('express')
const express_layout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const { session } = require('passport')
const path = require('path')
const session_ = require('express-session')
const app = express()
const passport = require('passport')

require('./configurations/VerifyLoginDetails')(passport)
// configure the database.
const database = require('./configurations/mongo').MongoURI

// establish a connection with the database

mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('---------------------------Connection established with MongoDB-----------'))
  .catch(err => console.log(err))

  .then(() => console.log('---------------------------Connection established with MongoDB-----------'))
  .catch(err => console.log(err))

app.use('/Authorised', require('./Routes/Authorised'))
// to access the css files..
// app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

// the middleware for EJS
app.use(express_layout)
app.set('view engine', 'ejs')

// Body parser for the forms
app.use(express.urlencoded({ extended: false }))

// Setup express session:
app.use(session_({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// setting up the routes
app.use('/', require('./Routes/index'))
app.use('/users', require('./Routes/users'))
app.use('/menu', require('./Routes/menu'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log('server running...'))
