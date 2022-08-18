const express_ = require('express')
const router = express_.Router()

// login page for user
router.get('/login', (req, res) => res.render('loginpage'))

// register link for user
router.get('/Register', (req, res) => res.render('registerpage'))

module.exports = router