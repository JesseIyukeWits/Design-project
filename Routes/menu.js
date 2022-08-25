const express_ = require('express')
const router = express_.Router()
const VehicleSchema = require('../models/LogDevice')
const user_ = require('../models/user')

router.get('/dashboard', (req, res) => res.render('dashboard'))
router.get('/log', (req, res) => res.render('logDevice'))

router.post('/log', (req, res) => {
  const { username, sensor, Vehicle, Year, ChannelId } = req.body
  console.log(username, sensor, Vehicle, Year, ChannelId)
  user_.findOne({ email: username })
    .then(user => {
      if (user) {
        const VehicleDetails = new VehicleSchema ({
          username: username, sensor: sensor, VehicleModel: Vehicle, ModelYear: Year, ChannelId: ChannelId
        })

        VehicleDetails.save()
          .then(menu => {
            res.redirect('./dashboard')
            console.log('Device logged')
          })
          .catch(err => console.log(err))
        user.updateOne({ $push: { ChannelId: ChannelId } })
      }
      else {
        res.send('Your username does not exist')
      }
    })
    .catch(err => console.log(err))

})

module.exports = router