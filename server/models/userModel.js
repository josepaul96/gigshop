
const mongoose = require('mongoose')
// const encrypt = require("mongoose-encryption")
const Schema = mongoose.Schema


const userSchema = new Schema({

    type: String,
    username: String,
    password: String,
    name: String,
    age:Number,
    location:new Schema({  
        latitude: String,
        longitude: String
    }),
    rating: Number,
    phoneNumber: String,
    photo: String,
    email:String,
    address:{
        address: String,
        landmark: String,
        city:String,
        state:String,
        pincode:Number
      },    
    skills:[new Schema({skillId:String,
             skillName:String,
             rating:Number,
             rate:Number},{strict:false})],
    gigGive:new Schema( {Gigs:[{
            status:String,
            gigId: String,
            bids:[{bidId:String}]
    }]},{strict:false}),
    gigTake:new Schema({Bids:[{
        status:String,
        bidId: String,
        gigs:[{gigId:String}]
    }]},{strict:false})
})

// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]})

module.exports = mongoose.model('user',userSchema,'users')