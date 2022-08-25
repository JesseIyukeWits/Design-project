const moment = require("moment") //install moment libary to get local time
const database = require('./dbFunctions')

// Energy consumption from kinetic enegry model

async function KM() {
    
    //intilisation
    //physical vehicle parameters
    let mass = 3900, cd = 0.36, crr = 0.02, A = 4.0, eff = 0.90, rgbeff = 0.65, p0=100

    //physics parameters
    let displacement=[],slope=[],dt=[],dv=[], diffElevation=[], velocity=[], date= []

    //force parameters
    let force=0, frr=0, fad=0, fsd = 0, grav = 9.81, rho = 1.184

    //Energy consumption parameters
    let ErP=0, ErB=0, ErO=0, energy=[], energyCosnumtpion=[]

    // Functions
    let rawTime= await database.timeStamp()
    let rawMAF = await database.MAF()
    let rawAltitude = await database.altitude()
    let rawLatitude = await database.latitude()
    let rawLongitude = await database.longitude()
    let rawSpeed = await database.speed()


    //length of Array- should be the same for other arrays
    lenArr= rawTime.length-1
    //console.log(lenArr)

   //  Set up array for energy consumption estimations
    for(let x=0; x<lenArr; x++){
        
        //unix to local time
        date= unixtoLocal(rawTime)

        // Convert speed in km/h to m/s , look up max speeds for certain Vehicles
        velocity[x]=rawSpeed[x]/3.6
        
        // Change in velocity between each timestep
        dv[x]= (rawSpeed[x+1]-(rawSpeed[x]))/3.6
 
        // Calculate elevation change
        
        diffElevation.push(Math.abs(rawAltitude[x+1]-rawAltitude[x])) 
        if(diffElevation[x] <=0.2)
        {
            diffElevation[x]=0
        }
 
        // Calculate time between samples
        dt.push(rawTime[x+1]-rawTime[x])

        //Coordinates
        // Lateral distance between two lat/lon coord pairs  (in m)
        let R = 6371; // radius of earth in km
        let diffLat = toRad(rawLatitude[x+1]-rawLatitude[x])
        let diffLon = toRad(rawLongitude[x+1]-rawLongitude[x])
        let lat1= toRad(rawLatitude[x])
        let lat2 = toRad(rawLatitude[x+1])

        // Calculate lateral distance
        let trig = Math.sin(diffLat/2) * Math.sin(diffLat/2) + Math.sin(diffLon/2) * Math.sin(diffLon/2) * Math.cos(lat1) * Math.cos(lat2)
        let c = 2 * Math.atan2(Math.sqrt(trig), Math.sqrt(1-trig))
        let latD = (R * c)*1000// (m)

        //3D Distance using pythogoras to account for elevation change
        let dist3d = Math.sqrt(((latD)**2) + ((diffElevation[x])**2))

        if (x==0){
            displacement[x]=0
        }
        else{
            displacement[x]=dist3d
        }
        if (displacement[x]!==0 && diffElevation[x]!==0){
            slope[x]= Math.asin((diffElevation[x])/dist3d)
        }
        else{
            slope[x]=0
        }

        //External forces
        if (velocity[x] != 0){ // No drag if velocity = 0
            frr = getRollingResistance(mass,crr, slope, velocity[x],grav) // (N)
            fad = getAerodynamicDrag(cd, A, velocity[x],rho) // (N)
            fsd = getRoadSlopeDrag(mass, slope,grav) // (N)

        }  
            force = frr + fad + fsd // (N)
            
            exp_speed_delta = force * dt[x] / mass// (N-s/kg)
            
            unexp_speed_delta = dv[x]- exp_speed_delta // (m/s)

            try{
                prop_brake_force = mass * unexp_speed_delta / dt[x] // (kg * m/s)/(s) = (N)
            
                kinetic_power = prop_brake_force * velocity[x] // (N)*(m/s) = (W)
                
                propultion_work = kinetic_power * dt[x]  // (W)*(s) = (J) 

            }
                  
            catch(e){
                prop_brake_force = 0
                kinetic_power = 0
                propultion_work = 0
            }

            // Compute energy expenditure
            ErO= p0* dt[x] //Offload Work (J)
            
            if(propultion_work>0){
                ErP= propultion_work/eff //Propulsion Energy 
            }
            else if(propultion_work<0){
                ErB= propultion_work*rgbeff // Recuperated Energy (from regen braking system)
            }

            energy[x] = (((ErO + ErP+ErB)/(3.6 * 10**6))) //in kwh
            energyCosnumtpion[x]= energy[x]/(displacement[x]*1000) // // in kwh/km

    }
    //Total enegry for a trip
    let totalEnergy = energy.reduce((partialSum, a) => partialSum + a, 0) //in kwh
    let totaldis=displacement.reduce((partialSumd, d) => partialSumd + d, 0) //in m
    let totalEnergyConsumption=totalEnergy/(totaldis)*1000 // in kwh/km
  
    console.log(totalEnergyConsumption)
    //return totalEnergyConsumption
    
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
    return -0.50 * rho * c_d * A * vel**2
}   
//Road Slope Force (N)
function getRoadSlopeDrag(mass, slope, grav){
    return -mass * grav * Math.sin(slope)
}


KM()
