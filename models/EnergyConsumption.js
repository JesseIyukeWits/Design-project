// to create a schema
const mongoose = require('mongoose')

const EnergyConsumptionSchema = new mongoose.Schema({
  rawspeed: [{ type: String, required: true }],
  Displacement: [{ type: String, required: true }],
  energyConsumption: { type: String, required: true },
  // ChannelId: { type: String, required: true },
  totaldisplacement: { type: String, required: true },
  travelstart: { type: String, required: true },
  travelend: { type: String, required: true },
  averageSpeed: { type: String, required: true },
  fuelConsumption: { type: String, required: true },
  behaviour: { type: String, required: true },
  DeviceID: { type: String, required: true },
  Date: [{ type: String, required: true }]

})

const energymodel = mongoose.model('Energy', EnergyConsumptionSchema)
module.exports = energymodel