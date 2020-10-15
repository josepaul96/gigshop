const express = require('express')
const adminRouter = express.Router();


const Gig = require("../models/gigModel")
const User = require("../models/userModel") 

const mongoose = require ("mongoose")
const db = "mongodb+srv://jose-paul:Begood96!@clustershaman.up5a8.mongodb.net/gigshop?retryWrites=true&w=majority"

const jwt =require("jsonwebtoken")


mongoose.connect(db,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
},err =>{
    if(err){
        console.log("Oops" + err)
    }
    else{
        console.log("Connected to MongoDB")
        }  
})

function verifyToken(req,res,next){
    if(!req.headers.authorization){
         return res.status(401).send("Unauthorized Request")
    }
    let token = req.headers.authorization.split(" ")[1];
    if (token===null){
        return res.status(401).send("Unauthorized Request")
    }
    let payload = jwt.verify(token, process.env.SECRET);
    req.userId = payload.subject;
    next();
}

adminRouter.get("/getallusers",verifyToken,(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    User.find().then((users)=>{
        if(users){
            
            res.status(200).send(users)
        }
        else{
            console.log("no gig")
        }
    })
})

adminRouter.get("/getallgigs",verifyToken,(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    Gig.find().then((gigs)=>{
        if(gigs){
            
            res.status(200).send(gigs)
        }
        else{
            console.log("no gig")
        }
    })
})


adminRouter.post("/deleteuser",verifyToken,(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    var userId = req.body.userId;
    User.findByIdAndDelete(userId).then(data=>{
        if(data){
            res.status(200).send(data)
        }
    })
})


adminRouter.post("/userfilter",verifyToken,(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    
    filter = req.body.filter;
   
    User.find({"skills.skillName":filter}).then(users=>{
        if(users){
            
            res.status(200).send(users)
        }
    })
})


adminRouter.post("/gigsfilter",verifyToken,(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    
    filter = req.body.filter;
  
    Gig.find({type:filter}).then(gigs=>{
        if(gigs){
            
            res.status(200).send(gigs)
        }
    })
})
module.exports= adminRouter;