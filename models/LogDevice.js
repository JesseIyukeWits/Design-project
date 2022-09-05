// to create a schema
const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
  username: { type: String, required: true },
  sensor: { type: String, required: true },
  VehicleModel: { type: String, required: true },
  ModelYear: { type: String, required: true },
  DeviceId: { type: String, required: true },
  date: { type: Date, default: Date.now }

})

const device = mongoose.model('Device', DeviceSchema)
module.exports = device