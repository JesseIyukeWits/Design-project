// this file is to verify a users login details using the passport configurations.
const mongoose = require('mongoose')
const Localstrategy = require('passport-local').Strategy

const UserModel = require('../models/user')

module.exports = function (passport) {
  passport.use(
    new Localstrategy({ usernameField: 'email' }, (email, password, done) => {
      // check if the email address exists in the database
      UserModel.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'Invalid email' })
          }

          if (!user.password) {
            return done(null, false, { message: 'Incorrect password' })
          }
          return done(null, user)
        })
        .catch(err => console.log(err))
    })
  )

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
      done(err, user)
    })
  })
}