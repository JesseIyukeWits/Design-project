const express = require('express')
const router = express.Router()

// the view that we want to render is the home page.
router.get('/', (req, res) => res.render('Homepage'))

module.exports = router