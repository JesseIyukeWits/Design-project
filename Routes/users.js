const express_ = require('express')
const router = express_.Router()

// login page for user 
router.get('/login', (req,res) =>res.send('Login'))

// register link for user 
router.get('/Register', (req,res) =>res.send('Register'))

module.exports = router