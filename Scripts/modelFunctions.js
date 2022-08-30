// Connect flespi to here


//Model functions
async function timeStamp() {
    try{
        let response1 = await require("./response1.json") // returns as json object(key-value pair)
        let timeArr=[]
        timeArr= response1.result.map((user) => user.timestamp) // convert to an array
        //console.log(timeArr) 

         //remove index contaning undefined values
        let arr= checkKeys()
        //console.log(arr.length) 
        for(let y=0;y<arr.length;y++)
        {
            timeArr.splice(arr[y],1) 
        } 
        //console.log(timeArr) 

        return timeArr
   
    }catch(e){
        return -1
    }
  }


  async function altitude() {
    try{
        let response1 = await require("./response1.json") // returns as json object(key-value pair)
        let altitudeArr=[]
        altitudeArr= response1.result.map((user) => user["position.altitude"]) // convert to an array

        //remove index contaning undefined values
        let arr= checkKeys()
        for(let y=0;y<arr.length;y++)
        {
            altitudeArr.splice(arr[y],1) 
        } 

        //console.log(altitudeArr) 
        return altitudeArr
   
    }catch(e){
        return -1
    }
  }

  async function latitude() {
    try{
        let response1 = await require("./response1.json") // returns as json object(key-value pair)
        let latitudeArr=[]
        latitudeArr= response1.result.map((user) => user["position.latitude"]) // convert to an array

        let arr= checkKeys()
        for(let y=0;y<arr.length;y++)
        {
            latitudeArr.splice(arr[y],1) 
        } 
        //console.log(latitudeArr.length) 
        return latitudeArr
   
    }catch(e) {
        return -1
    }
  }

  async function longitude(){
    try{
        let response1 = await require("./response1.json") // returns as json object(key-value pair)np
        let longitudeArr=[]
        longitudeArr= response1.result.map((user) => user["position.longitude"]) // convert to an array

        //remove index contaning undefined values
        let arr= checkKeys()
        for(let y=0;y<arr.length;y++)
        {
            longitudeArr.splice(arr[y],1) 
        } 
       //console.log(longitudeArr)
       return longitudeArr
   
    }catch(e){
        return -1
    }
  }


  async function speed(){
    try{
        let response1 = await require("./response1.json") // returns as json object(key-value pair)
        let speedArr=[]
        speedArr= response1.result.map((user) => user["position.speed"]) // convert to an array

        //remove index contaning undefined values
        let arr= checkKeys()
        for(let y=0;y<arr.length;y++)
        {
            speedArr.splice(arr[y],1) 
        } 
        //console.log(speedArr)
        return speedArr
   
    }catch(e){
        return -1
    }
  }

  async function ID(){
    try{
        let response1 = await require("./response1.json") // returns as json object(key-value pair)np
        let IDArr=[]
        IDArr= response1.result.map((user) => user["channel.id"]) // convert to an array
       // console.log(IDArr)
        return IDArr
   
    }catch(e){
        return -1
    }
  }


//Check for undefined keys
function checkKeys(){

    let arr= []
        let response1 = require("./response1.json") // returns as json object(key-value pair)
        //console.log(response1.result.length)
        for(let x=0; x<response1.result.length-1; x++){
            if(response1.result[x]["position.latitude"]== undefined || response1.result[x]["position.longitude"]== undefined || (response1.result[x]["timestamp"]===response1.result[x+1]["timestamp"])) {
                // || (response1.result[x]["timestamp"]==response1.result[x+1]["timestamp"])
                arr[x]=x
                //console.log(arr[x]) // print out index
            }
            //console.log(arr)
        }

        //remove undefined values
        arr = arr.filter(function( element ) {
            return element !== undefined;
         })

        //console.log(arr)
        return arr

}


 module.exports={timeStamp, altitude, latitude, longitude,speed, ID}

 //timeStamp()

