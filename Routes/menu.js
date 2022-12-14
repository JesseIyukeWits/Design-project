const express_ = require('express')
const router = express_.Router()
const VehicleSchema = require('../models/LogDevice')
const user_ = require('../models/user')
const EnergyInfo = require('../models/EnergyConsumption')


router.get('/dashboard', (req, res) => res.render('dashboard'))
router.get('/log', (req, res) => res.render('logDevice'))
router.get('/view', (req, res) => res.render('EnergyConsumption'))
router.get('/display', (req, res) => res.render('display'))

// function to handle logging a device.
router.post('/log', (req, res) => {
  const { username, sensor, Vehicle, Year, Deviceid } = req.body
  console.log(username, sensor, Vehicle, Year, Deviceid)
  user_.findOne({ email: username })
    .then(user => {
      if (user) {
        const VehicleDetails = new VehicleSchema ({
          username: username, sensor: sensor, VehicleModel: Vehicle, ModelYear: Year, DeviceId: Deviceid
        })

        VehicleDetails.save()
          .then(menu => {
            res.redirect('./dashboard')
            console.log('Device logged')
          })
          .catch(err => console.log(err))
        // user.updateOne({ $push: { ChannelId: ChannelId } })
      }
      else {
        res.send('Your username does not exist')
      }
    })
    .catch(err => console.log(err))
})

/* The following function extracts information from the database and displays it,
on the display.ejs page.
*/

router.post('/view', (req, res) => {
  const { deviceID } = req.body
  console.log(deviceID)
  // const arr = []
  VehicleSchema.findOne({ DeviceId: deviceID })
    .then(device => {
      if (device) {
        // res.render('display', { EnergyConsumption: device.energyConsumption })
        EnergyInfo.find({ DeviceID: deviceID }, function (err, val) {
          if (err) {
            console.log(err)
          } else {
            // res.render('display', { jjj: val })
            VehicleSchema.find({ DeviceId: deviceID }, function (err, valV) {
              if (err) {
                console.log(err)
              } else {
                res.render('display', { vehicle: valV, jjj: val })
              }
            })
          }
        })
        // find the vehicle schema too
      } else {
        res.send('Device ID is incorrect or does not exist')
      }
    })
    .catch(err => console.log(err))
  // res.render('display', { show: channelID })
  /*
  VehicleSchema.findOne({ ChannelId: channelID })
    .then(device => {
      if (device) {
        // res.render('display', { EnergyConsumption: device.energyConsumption })
        EnergyInfo.findOne({ ChannelId: channelID })
          .then(energy => {
            if (energy) {
              res.render('display', {
                data: {
                  Displacement: energy.disp,
                  EnergyConsumption: energy.energyConsumption,
                  disp: energy.displacement
                }
              })
              console.log(energy.disp, ' i am energy') 
            }
          })
      } else {
        res.send('DOES NOT EXIST')
      }
    })
    .catch(err => console.log(err)) */

})
module.exports = router