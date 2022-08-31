// Connect flespi to here
const fetch = require('node-fetch')



/*  async function flespi(){
    let deviceID=4608732
    
    let headers = {
        'Authorization': 'FlespiToken i1nYheeHfKDbCyp225Se9bAN52CnW2i4RuQXyVuBtXDUkQMcJseItCmmuMzgEG8k'
    }
    let flespiData
    await fetch(`https://flespi.io/gw/devices/${deviceID}/messages`, {headers: headers}).then(data=>{
        return data.json()
    }).then(data=>{
        flespiData = data
    })

    //console.log(flespiData)
    return flespiData
} */
 
//Model functions
async function timeStamp(){
    try{
        
        //let response1 = await flespi() // returns as json object(key-value pair)
        let response1 = await require("./response1.json") // returns as json object(key-value pair)
        let timeArr=[]
        timeArr= response1.result.map((user) => user.timestamp) // convert to an array
        //console.log(timeArr.length) 

         //remove index contaning undefined values
        let arr= checkKeys()
        //console.log(arr) 
        for(let y=arr.length-1;y>=0;y--)
        {
            timeArr.splice(arr[y],1) 
        } 
        //console.log(timeArr.length)

        return timeArr
   
    }catch(e){
        return -1
    }
  }


  async function altitude(){
    try{
        //let response1 = await flespi()
        let response1 = await require("./response1.json") // returns as json object(key-value pair)
        let altitudeArr=[]
        altitudeArr= response1.result.map((user) => user["position.altitude"]) // convert to an array

        //remove index contaning undefined values
        let arr= checkKeys()
        for(let y=arr.length-1;y>=0;y--)
        {
            altitudeArr.splice(arr[y],1) 
        }

        //console.log(altitudeArr) 
        return altitudeArr
   
    }catch(e){
        return -1
    }
  }

  async function latitude(){
    try{
        
        //let response1 = await flespi() // returns as json object(key-value pair)
        let response1 = await require("./response1.json") // returns as json object(key-value pair)
        let latitudeArr=[]
        latitudeArr= response1.result.map((user) => user["position.latitude"]) // convert to an array

        let arr= checkKeys()
        for(let y=arr.length-1;y>=0;y--)
        {
            latitudeArr.splice(arr[y],1) 
        }

        //console.log(latitudeArr.length) 
        return latitudeArr
   
    }catch(e){
        return -1
    }
  }

  async function longitude(){
    try{
        //let response1 = await flespi() // returns as json object(key-value pair)
        let response1 = await require("./response1.json") // returns as json object(key-value pair)np
        let longitudeArr=[]
        longitudeArr= response1.result.map((user) => user["position.longitude"]) // convert to an array

        //remove index contaning undefined values
        let arr= checkKeys()
        for(let y=arr.length-1;y>=0;y--)
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
        //let response1 = await flespi() // returns as json object(key-value pair)
        let response1 = await require("./response1.json") // returns as json object(key-value pair)
        let speedArr=[]
        speedArr= response1.result.map((user) => user["position.speed"]) // convert to an array

        //remove index contaning undefined values
        let arr= checkKeys()
        for(let y=arr.length-1;y>=0;y--)
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
        //let response1 = await flespi() // returns as json object(key-value pair)
        let response1 = await require("./response1.json") // returns as json object(key-value pair)np
        let IDArr=[]
        IDArr= response1.result.map((user) => user["channel.id"]) // convert to an array

        let arr= checkKeys()
        for(let y=arr.length-1;y>=0;y--)
        {
            IDArr.splice(arr[y],1) 
        }
       // console.log(IDArr)
        return IDArr
   
    }catch(e){
        return -1
    }
  }

  async function MAF(){
    try{
        //let response1 = await flespi()
        let response1 = await require("./response1.json") // returns as json object(key-value pair)
        let mafArr=[]
        mafArr= response1.result.map((user) => user["can.maf.air.flow.rate"]) // convert to an array
        //console.log(mafArr.length) 

        //remove index contaning undefined values
        let arr= checkKeys()
        for(let y=arr.length-1;y>=0;y--)
        {
            mafArr.splice(arr[y],1) 
        }
        
        /* for(let z=0;z<mafArr.length;z++){

            if(mafArr[z]== undefined)
            {
                console.log(z)
            }
        }  */

        //console.log(mafArr) 
        return mafArr
   
    }catch(e){
        return -1
    }
  }

  async function removedSamples(){
    try{
        //let response1 = await flespi()
        let response1 = await checkKeys()
        let removed= response1.length

        //console.log(removed)
        
        return removed
   
    }catch(e){
        return -1
    }
  }





//Check for undefined keys
function checkKeys(){

    let arr= []
        let response1 = require("./response1.json") // returns as json object(key-value pair)
        //console.log(response1.result.length)
        //let response1 = flespi() // returns as json object(key-value pair)
        for(let x=0; x<response1.result.length; x++){
            if(response1.result[x]["position.latitude"]== undefined || response1.result[x]["position.longitude"]== undefined || response1.result[x]["can.maf.air.flow.rate"]== undefined || (response1.result[x]["timestamp"]===response1.result[x+1]["timestamp"])) {
                // || (response1.result[x]["timestamp"]==response1.result[x+1]["timestamp"])
                arr[x]=x
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


 module.exports={timeStamp, altitude, latitude, longitude,speed, ID, MAF,removedSamples}

 //flespi(4608732) //call device ID

 //removedSamples()

