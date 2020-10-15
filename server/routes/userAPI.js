const express = require('express')
const userRouter = express.Router();
// const md5 = require("md5")

// Database Encryption
const bcrypt = require("bcrypt");
const saltRounds= 10; 

// authentication

const jwt =require("jsonwebtoken")




const User = require("../models/userModel")

const mongoose = require ("mongoose")
const db = "mongodb+srv://jose-paul:Begood96!@clustershaman.up5a8.mongodb.net/gigshop?retryWrites=true&w=majority"

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

userRouter.post("/checkusername", (req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    newusername = req.body.username;
    User.findOne({username: newusername},(error, user)=>{
        if(error){
            res.status(404).send("not found")
        }
        else if(user){
            res.status(401).send("Username Already Exists")
        }
        else{
            res.status(200).json("Username Is Available")
        }
    })

})



userRouter.post("/insert", (req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    // req.body.userData.password = md5(req.body.userData.password )
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.userData.password, salt, function(err, hash) {
            // Store hash in your password DB.
            req.body.userData.password = hash;
            let userData = req.body.userData;
            let newUser = new User(userData);
             newUser.save((error, registeredUser)=>{
            if(error){
                console.log("Oops " + error)
            }
            else{
                let payload = {subject:{userid:registeredUser._id,username:registeredUser.username}}
                let token = jwt.sign(payload, process.env.SECRET)
                console.log("User Added")
            res.status(200).send({token})
            }
        }) 



        });
    });


    
})





userRouter.post("/login",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    // req.body.userData.password = md5(req.body.userData.password)
    let userData = req.body.userData;
    
    User.findOne({username: userData.username},(error, user)=>{
        if(error){
            res.send("not found")
        }
        else{
            if(!user){
                console.log("Invalid Email")
                res.status(401).send("Invalid Username")
            }
            else{
                bcrypt.compare(userData.password, user.password, function(err, result) {
                    if (result===true){
                        let payload = {subject:{userid:user._id,username:user.username}}
                        let token = jwt.sign(payload, process.env.SECRET)
                        console.log("valid user")
                        res.status(200).send({token})
                    }
                    else{
                        console.log("Invalid Password")
                        res.status(401).send("Invalid Password")
                    }
                });

            }

        }
    })
})


module.exports = userRouter;