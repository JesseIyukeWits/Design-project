const express_ = require('express')
const router = express_.Router()

router.get('/log', (req, res) => res.render('logDevice'))

module.exports = router