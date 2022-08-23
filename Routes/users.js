const express_ = require('express')
const router = express_.Router()
const User_ = require('../models/user.js')


// for the encryption process
const encrypt = require('bcryptjs')

// login page for user - when user requests login page
router.get('/login', (req, res) => res.render('loginpage'))

// when user requests for /register then send the register page
router.get('/Register', (req, res) => res.render('registerpage'))

// handle the information recieved from the login page
router.post('/Register', (req, res) => {
  const { name, email, password, ConfirmPassword } = req.body
  // create an error to handle errors
  const errors_ = []

  // if the password and the confirmation password matches.
  if (password !== ConfirmPassword) {
    errors_.push({ message_: 'Passwords do not match' })
  }

  // Ensure that all the details have been filled out.
  if (!name || !email || !password || !ConfirmPassword) {
    errors_.push({ message_: 'Fill in all details' })
  }

  // Ensure that the users password is greater than 8 characters.
  if (password.length < 8) {
    errors_.push({ message_: 'Password must be greater than 8 characters' })
  }

  // if any errors exist then send the errors and call the register page again.
  if (errors_.length > 0) {
    res.render('registerpage', {
      errors_, name, email, password, ConfirmPassword
    })
  } else {
    // create the new user by passing in the information to the model.
    const UserInfo = new User_({
      email, name, password, ConfirmPassword
    })

    UserInfo.save()
      .then(user => {
        res.redirect('/login')
        console.log('DONDDDDDDD--------')
      })
      .catch(err => console.log(err))
  }
})
module.exports = router