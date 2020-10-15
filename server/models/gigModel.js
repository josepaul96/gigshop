const mongoose = require('mongoose')
const encrypt = require("mongoose-encryption")

const Schema = mongoose.Schema

const gigSchema = new Schema ({

    
    userId: String,
    title: String,
    type: String,
    duration:{
        time:Number,
        durationType:String
        },
    rates:{
        rate:Number,
        rateType:String
        },
    status: String,
    description:String,
    location:{  
        latitude: String,
        longitude: String
},
    bids:[new Schema({
        offer:{
            rate:Number,
            rateType:String
        },
        status:String,
        gigsterId:String,
        gigsterName:String,
        gigsterAge:Number,
        gigsterPhoneNumber:String,
        gigsterRating:Number,
        location:{
            latitude:Number, 
            longitude:Number
            },
        comments:String
    })],
    address:{
        buildingAddress: String,
        landmark: String,
        city:String,
        state:String,
        pincode:Number
    }

})

module.exports= mongoose.model('gigs', gigSchema, 'gigs');