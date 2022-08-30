// to create a schema
const mongoose = require('mongoose')

const EnergyConsumptionSchema = new mongoose.Schema({
  // rawspeed: { type: String, required: true },
  disp: { type: String, required: true },
  energyConsumption: { type: String, required: true },
  ChannelId: { type: String, required: true }
  // date: { type: String, required: true }

})

const energymodel = mongoose.model('Energy', EnergyConsumptionSchema)
module.exports = energymodel