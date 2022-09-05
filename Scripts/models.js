const moment = require("moment") //install moment libary to get local time
const database = require('./modelFunctions')

// database files:
const express_ = require('express')
const router = express_.Router()
const VehicleSchema = require('../models/LogDevice')
const energyScript = require('../Scripts/models.js')
const mongoose = require('mongoose')
const EnergyModel = require('../models/EnergyConsumption')

const mongodatabase = require('../configurations/mongo').MongoURI

// establish a connection with the database

mongoose.connect(mongodatabase, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('---------------------------Connection established with MongoDB-----------'))
  .catch(err => console.log(err))

  .then(() => console.log('---------------------------Connection established with MongoDB-----------'))
  .catch(err => console.log(err))


// Energy consumption from kinetic enegry model

async function KM() {
    
    //intilisation
    //physical vehicle parameters
    //let mass = 3900, cd = 0.36, crr = 0.02, A = 4.0, eff = 0.90, rgbeff = 0.65, p0=100

    //Toyota Yaris physical vehicle parameters
    let mass = 1016, cd = 0.36, crr = 0.02, A = 6.42, eff = 0.90, rgbeff = 0.65, p0=100

    //physics parameters
    let displacement=[],slope=[],dt=[],dv=[], diffElevation=[], velocity=[], date= [], dist3d=[]

    //force parameters
    let force=[], frr=[], fad=[], fsd =[], grav = 9.81, rho = 1.184

    //Energy consumption parameters
    let ErP=[], ErB=[], ErO=[], energy=[], energyCosnumtpion=[], prop_brake_force=[],kinetic_power=[],propultion_work=[]
    let exp_speed_delta=[], unexp_speed_delta=[], aveSpeed= []

    // fuel parameters
    let fuelType='Gas'
    let fuelConsume=[]

    // Functions
    let rawTime= await database.timeStamp()
    let rawAltitude = await database.altitude()
    let rawLatitude = await database.latitude()
    let rawLongitude = await database.longitude()
    let rawSpeed = await database.speed()
    let ID= await database.ID()
    let rawMAF= await database.MAF()

    // Convert speed in km/h to m/s , look up max speeds for certain Vehicles
    velocity= rawVelocity(rawSpeed)

    //number of removed samples due to data collection error
    let removeSample= await database.removedSamples()

    //fuel consumption model
    fuelConsume= fuel(rawMAF,rawSpeed,fuelType)
    
    //device ID from flespi
    let deviceID= ID[0]
    
    //length of Array- should be the same for other arrays
    lenArr= rawAltitude.length-1

    //console.log(lenArr)
    date = unixtoLocal(rawTime)

    
    //average speed
    let totalSpeed = rawSpeed.reduce((partialSum, a) => partialSum + a, 0) 
    aveSpeed= totalSpeed/rawSpeed.length


   //  Set up array for energy consumption estimations
    for(let x=0; x<lenArr; x++){
        
        // Calculate time between samples
        dt.push(rawTime[x+1]-rawTime[x])
        
        // Change in velocity between each timestep
        dv[x]= (velocity[x+1]-(velocity[x]))
 
        // Calculate elevation change
        
        diffElevation.push(rawAltitude[x+1]-rawAltitude[x]) 
        if((Math.abs(diffElevation[x]) <0.2))
        {
            diffElevation[x]=0
        }
        //Coordinates
        // Lateral distance between two lat/lon coord pairs  (in m)
        let R = 6371 //radius of earth in km
        let diffLat = toRad(rawLatitude[x+1]-rawLatitude[x])
        let diffLon = toRad(rawLongitude[x+1]-rawLongitude[x])
        let lat1= toRad(rawLatitude[x])
        let lat2 = toRad(rawLatitude[x+1])

        // Calculate lateral distance
        let trig = Math.sin(diffLat/2) * Math.sin(diffLat/2) + Math.sin(diffLon/2) * Math.sin(diffLon/2) * Math.cos(lat1) * Math.cos(lat2)
        let c = 2 * Math.atan2(Math.sqrt(trig), Math.sqrt(1-trig))
        let latD = (R * c)*1000 // (m)

        //3D Distance using pythogoras to account for elevation change
        dist3d[x] = Math.sqrt(((latD)**2) + ((diffElevation[x])**2))

        if (x==0){
            displacement[x]=0
        }
        else{
            displacement[x]=dist3d[x]
        }
        if (displacement[x]!==0 && diffElevation[x]!==0){
            slope[x]= Math.asin((diffElevation[x])/dist3d[x])
        }
        else{
            slope[x]=0
        } 
        // always initilise external forces
        frr[x]=0
        fad[x]=0
        fsd[x]=0
        force[x]=0 

        //External forces
        if (velocity[x] != 0){ // No drag if velocity = 0
            frr [x]= getRollingResistance(mass,crr, slope[x], velocity[x],grav) // (N)
            fad[x] = getAerodynamicDrag(cd, A, velocity[x],rho) // (N)
            fsd[x] = getRoadSlopeDrag(mass, slope[x],grav) // (N)

        }
 
        force[x] = frr[x] + fad[x] + fsd[x] // (N)
            
        exp_speed_delta[x] = force[x] * (dt[x] / mass)// (N-s/kg)
            
        unexp_speed_delta[x] = dv[x]- exp_speed_delta[x] // (m/s)

        try{
            prop_brake_force[x] = mass * unexp_speed_delta[x] / dt[x] // (kg * m/s)/(s) = (N)
            
            kinetic_power[x] = prop_brake_force[x] * velocity[x] // (N)*(m/s) = (W)
                
             propultion_work[x] = kinetic_power[x] * dt[x]  // (W)*(s) = (J) 
            }
                  
        catch(e){
                prop_brake_force[x] = 0
                kinetic_power[x] = 0
                propultion_work[x] = 0
            } 

            // Compute energy expenditure
            ErO[x]= p0* dt[x] //Offload Work (J)
            
            if(propultion_work[x]>0){
                ErP[x]= propultion_work[x]/eff //Propulsion Energy
                ErB[x]=0
                 
            }
            else if(propultion_work[x]<0){
                ErB[x]= propultion_work[x]*rgbeff // Recuperated Energy (from regen braking system)
                ErP[x]=0
            }
             else if(propultion_work[x] == 0 || propultion_work[x] == undefined  || propultion_work[x] == Infinity || propultion_work[x] == NaN){
                ErP[x]=0
                ErB[x]=0
            }  

            energy[x] = (((ErO[x] + ErP[x]+ErB[x])/(3.6 * 10**6))) //in kwh
            energyCosnumtpion[x]= energy[x]/(displacement[x]/1000) // // in kwh/km

            //console.log(dt[x])



    }
    //Total enegry for a trip
    let totalEnergy = energy.reduce((partialSum, a) => partialSum + a, 0) //in kwh
    let totaldis=displacement.reduce((partialSumd, d) => partialSumd + d, 0) //in m
    let totalEnergyConsumption=(totalEnergy/((totaldis)/1000)) // in kwh/km

    //Fuel behaviour
    let totalFuelConsumption= fuelConsume.reduce((partialSum, a) => partialSum + a, 0) // in litres/km

    if(totalFuelConsumption<0.5)
    {
        Behaviour='Quiet' 
    }
    if(totalFuelConsumption >= 0.05 && totalFuelConsumption<0.1)
    {
        Behaviour='Normal'
    }

    if(totalFuelConsumption>=0.1)
    {
        Behaviour='Aggressive' 
    }
    
    console.log(deviceID)
    console.log(totalEnergyConsumption, ' - total energy ')

    console.log(totalFuelConsumption, '=-----fuel consumption ----')

    console.log(Behaviour, '---behaviour--')
  // arrays needed to be sent to database:
  const enddate = date.length
  console.log(enddate)
  VehicleSchema.findOne({ DeviceId: deviceID })
    .then(device => {
      if (device) {
        const EnergyInfo = new EnergyModel ({
          rawspeed: rawSpeed,
          Displacement: displacement,
          energyConsumption: totalEnergyConsumption,
          // ChannelId: channelID,
          totaldisplacement: totaldis,
          travelstart: date[0],
          travelend: date[enddate - 1],
          averageSpeed: aveSpeed,
          fuelConsumption: totalFuelConsumption,
          behaviour: Behaviour,
          DeviceID: deviceID,
          Date: date
        
        })

        EnergyInfo.save()
          .then(console.log('-------Energy logged--------------'))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))


  // rawspeed,displacement, energyCosnumption, date,channelID, aveSpeed
  
    return totalEnergyConsumption
}


function unixtoLocal(timeStamp) {
    let date = []
    timeStamp.forEach(element => {
        date.push(moment.unix(element).format("DD-MM-YYYY HH:mm:ss"))
    });
    //console.log(date)
    return date

    //Check if the time logger got stuck for a second, and correct if so
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value*(Math.PI/180)
}


//Rolling Resistance (road friction) (N)
function getRollingResistance(mass,crr,slope, vel,grav) {
    let rr = 0 //friction
    if (vel>0.3){
        // negative due to opposite direction
        rr = -mass * grav * crr * Math.cos(slope) 
    }
   return rr
}  

//Aerodynamic Drag Force (N)
function getAerodynamicDrag(c_d, A, vel, rho){
    return -0.50 * rho * c_d * A * (vel**2)
}   
//Road Slope Force (N)
function getRoadSlopeDrag(mass, slope, grav){
    return -mass * grav * Math.sin(slope)
}

function rawVelocity(speed){

    let velocityarr=[]
    for(let x=0;x<=speed.length;x++){

        if(speed[x]>=0.5){
            velocityarr[x]= speed[x]/3.6
        }
        else{
            velocityarr[x]=0
        }
    }
    return velocityarr  

}

function fuel(maf,speed,type){

    let fuelConsumption=[]
    let Afr=0
    let fd=0
    let flow=0

    if(type == 'Gas'){ 
        Afr = 14.7
        fd=820 //grams/dm^3
     }
     if(type=='diesel'){ 
       Afr=14.5
       fd= 750 // grams/dm^3

       }
    for(let x=0;x<=maf.length;x++)
    {
        if(speed[x]>0.5){

            flow=((maf[x]*3600)/100)/(Afr*fd) // litres/hr
            fuelConsumption[x]=(flow/speed[x]) //litres/km

        }
        else{
            fuelConsumption[x]=0
        }

    }
    return fuelConsumption
}


KM()
