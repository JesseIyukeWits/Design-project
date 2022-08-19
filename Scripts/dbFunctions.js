// Connection to mongoDB

//Model functions
async function timeStamp(){
    try{
        let response = await require("./response.json") // returns as json object(key-value pair)
        let timeArr=[]
        timeArr= response.result.map((user) => user.timestamp) // convert to an array
        console.log(timeArr) 
   
    }catch(e){
        return -1
    }
  }

  async function MAF(){
    try{
        let response = await require("./response.json") // returns as json object(key-value pair)
        let MAFArr=[]
        MAFArr= response.result.map((user) => user["can.maf.air.flow.rate"]) // convert to an array
        console.log(MAFArr) 
   
    }catch(e){
        return -1
    }
  }

  async function altitude(){
    try{
        let response = await require("./response.json") // returns as json object(key-value pair)
        let altitudeArr=[]
        altitudeArr= response.result.map((user) => user["position.altitude"]) // convert to an array
        console.log(altitudeArr) 
   
    }catch(e){
        return -1
    }
  }

  async function latitude(){
    try{
        let response = await require("./response.json") // returns as json object(key-value pair)
        let latitudeArr=[]
        latitudeArr= response.result.map((user) => user["position.latitude"]) // convert to an array
        console.log(latitudeArr) 
   
    }catch(e){
        return -1
    }
  }

  async function longitude(){
    try{
        let response = await require("./response.json") // returns as json object(key-value pair)
        let longitudeArr=[]
        latitudeArr= response.result.map((user) => user["position.longitude"]) // convert to an array
        console.log(longitudeArr) 
   
    }catch(e){
        return -1
    }
  }

  async function longitude(){
    try{
        let response = await require("./response.json") // returns as json object(key-value pair)
        let longitudeArr=[]
        latitudeArr= response.result.map((user) => user["position.longitude"]) // convert to an array
        console.log(longitudeArr) 
   
    }catch(e){
        return -1
    }
  }

  async function speed(){
    try{
        let response = await require("./response.json") // returns as json object(key-value pair)
        let speedArr=[]
        speedArr= response.result.map((user) => user["position.speed"]) // convert to an array
        console.log(speedArr) 
   
    }catch(e){
        return -1
    }
  }

  


 module.exports={timeStamp, MAF, altitude, latitude, longitude,speed};
