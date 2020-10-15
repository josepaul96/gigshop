const express = require('express')
const gigRouter = express.Router();


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


gigRouter.post("/getuserdetails",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    let userId = req.body.userId;
    User.findById(userId).then((user)=>{
        if(user){
            res.status(200).send(user)
        }
    })
})

// Gig CRUD


// Get all Posted Gigs by Everyone


gigRouter.post("/filtergigs",verifyToken,(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    filter = req.body.condition;
    Gig.find({type:filter}).then((data=>{
        if(data){
            
            res.status(200).send(data)
        }
        else{
            console.log("oops")
        }
    }))
})

gigRouter.post("/allgigs",verifyToken,(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    var userId= req.body.userId;
    let gigs = {
        allgigs: [],
        mybids: []
    }
    Gig.find({$and:
        [
            {$or: [{status:"Bidding Ongoing"},{status:"Bidding Awaiting"}]},
            {userId: {$ne: userId}}
        ]}
        ).then((allgigs)=>{
        if(allgigs){
            gigs.allgigs =allgigs   
        }
       
    })

    setTimeout(() => {
        Gig.find({"bids.gigsterId": userId},(err,gigsWithMyBids)=>{
            if(gigsWithMyBids){
                
                setTimeout(() => {
                    gigsWithMyBids.forEach(gig => {          
                        gig.bids.forEach(bid => {
                            if(bid.gigsterId==userId){
                                gigs.mybids.push(bid)
                            }
                        });
                    });

                    res.status(200).send(gigs)
                }, 200);              
            }       
    })
    }, 500);




})


// Post a new gig

gigRouter.post("/morethanthreegigs",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    let userId= req.body.userId;
    Gig.find({$and:
        [
            {status:"Bidding Closed"},
            {userId:userId}
        ]})
        .then((gigs)=>{
        if(gigs){

            res.status(200).send(gigs)
        }
    })


})


gigRouter.post("/insert",verifyToken, (req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    let newGigData = req.body.gig;

    let newGig = new Gig (newGigData);
    newGig.save((error, gigAdd)=>{
        if(error){
            console.log("Oops " + error)
        }
        else{
            
           res.status(200).send(gigAdd)
        }
    }) 
})


// Retreive all the gigs posted by a user

gigRouter.post("/getmypostedgigs",verifyToken,(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");

    let userId = req.body.userId;
    Gig.find({userId:userId}).then((gigs)=>{
        if(gigs){
            res.status(200).send(gigs)
        }
    })
})

// Retrieve one gig from a user

gigRouter.post("/getmyselectedgig",verifyToken,(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    
    let jobId = req.body.jobId;
    Gig.findOne({_id:jobId}).then((gig)=>{
        if(gig){
            
            res.status(200).send(gig)
        }
        else{
            console.log("no gig")
        }
    })

})


// Edit a gig

gigRouter.put("/editgig",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    let editedGig = req.body.gig;  
    Gig.findByIdAndUpdate(editedGig._id,{$set:editedGig}, (err, result)=>{
        if(err){
            console.log(err);
            res.status(401).send("not edited")
        }
        res.status(200).send(result)
    });
    })



// Delete a gig

gigRouter.post("/deletegig",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    
    let jobId = req.body.jobId;
    Gig.deleteOne({_id:jobId},function(err, result) {
        if (err) {
            console.log(err)
          res.status(401).send(err);
        } else {
            
          res.status(200).send(result);
        }
      })

})







// Make a bid to a Gig

gigRouter.post("/makebid", (req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    var newBid= req.body.bid;
    let jobId = newBid.jobId;
    
    Gig.findOneAndUpdate({_id:jobId},{$push:{bids:newBid},status:"Bidding Ongoing"}, (err,gig)=>{
        if(err){
            console.log(err);
        }
        else{
            res.status(200).send(gig)
        }
    })
    
})
            
            
// Accept Bid

gigRouter.post("/acceptbid",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    acceptBidDetails =req.body.bidDetails;
    Gig.findOneAndUpdate({_id:acceptBidDetails.jobId},{status:"Bidding Closed"},(err,gig)=>{
        if(err){
            console.log(err);
        }
        else{
            Gig.findOneAndUpdate({"bids._id": acceptBidDetails.bidId},{'$set':{"bids.$.status":"Bid Accepted"}},(err,bid)=>{
                if(bid){
                    res.status(200).send(bid)
                }
                else{

                    console.log("nobid")
                }
            })
            

        }
    })
    
})


// Deny Bid

gigRouter.post("/denybid",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    deleteBidDetails =req.body.bidDetails;
    Gig.findOneAndUpdate({"bids._id": deleteBidDetails.bidId},{'$set':{"bids.$.status":"Bid Denied"}},(err,bid)=>{
        if(bid){
            
            res.status(200).json("Deleted")
        }
        
    })

})


// Gigster Bid CRUD 


// Access Bid Details and User Details

gigRouter.post("/getmybids",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    let myGigsterId= req.body.userId;
    var allbids=[];
    let bidDetails = {
        bids: [],
        gigOwner: []
    }
    
    Gig.find({"bids.gigsterId":myGigsterId}).then((gigs)=>{
          gigs.forEach(gig => {
            allbids.push(gig.bids)
            bidDetails.gigOwner.push(gig.userId)
        });    
    })
    setTimeout(() => {

        allbids.forEach(gigBid => {
                gigBid.forEach(bid => {
                    if(bid.gigsterId===myGigsterId){
                        bidDetails.bids.push(bid)
                    }
            });
        });       
        res.status(200).send(bidDetails)
    }, 300);   
})


// Access One Bid

gigRouter.post("/getmybid",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    
    let bidId = req.body.bidId;
    Gig.find({"bids._id":bidId}).then((gig)=>{
        setTimeout(() => {
            gig[0].bids.forEach(bid => {
                if(bid._id==bidId){
                    res.status(200).send(bid)
                }
          }); 
        }, 100);
        
  })

})


// Edit a bid

gigRouter.post("/editmybid",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    
    let toEditBid = req.body.bid;

Gig.findOneAndUpdate({"bids._id": toEditBid._id},{'$set':{"bids.$.offer.rate":toEditBid.offer.rate,"bids.$.offer.rateType":toEditBid.offer.rateType,"bids.$.comments":toEditBid.comments}},(err,bid)=>{
    if(bid){

        res.status(200).send(bid)
    }
    
})

})


// Delete a bid

gigRouter.post("/deletemybid",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    let toDeleteBid = req.body.bidId;
    Gig.findOneAndUpdate({"bids._id": toDeleteBid}, { $pull: { 'bids': {  _id: toDeleteBid } } },function(err,model){
        if(err){
             console.log(err);
             res.send(err);
          }
          
            res.send(model);
      });
        
    })    


 // Completing a Gig


//  Gig Owner Giving Gigster Rating
 gigRouter.post("/gigcomplete",(req,res)=>{

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    
    
    userId= req.body.jobDone.userId;
    gigId= req.body.jobDone.gigId;
    gigsterRating = req.body.jobDone.gigsterRating
    Gig.findOneAndUpdate({_id:gigId},{status:"Rating 1 Complete"},(err,gig)=>{
        if(err){
            console.log(err);
        }
        else if(gig){
            
            for(i=0;i<gig.bids.length;i++){
                var bid= gig.bids[i]; 
                
                if(bid.status=="Bid Accepted"){
                    
                    User.findOne({_id:bid.gigsterId}).then((gigster)=>{
                        if (gigster.rating===null) {
                        
                            User.updateOne({_id:bid.gigsterId},{rating:gigsterRating},(err,user)=>{
                                if(err){
                                    console.log(user)
                                }
                                else{
                                    console.log(user)
                                }
                            })
                        }
                        else{
                            
                            gRating= (gigster.rating +parseInt(gigsterRating))/2;
                            User.updateOne({_id:bid.gigsterId},{rating:gRating},(err,user)=>{
                                if(err){
                                    console.log("error while updating rating")
                                }
                                else{
                                    res.status(200).send(user)
                                }
                            }) 
                            
                        }
                    })
                    break;
                }
            }
        }
    })
    
 })


// Gigster giving owner rating

// Check if rating is pending
gigRouter.post("/ratingpending",(req,res)=>{

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    
    
    userId= req.body.userId;
    
    Gig.findOneAndUpdate({"bids.gigsterId":userId,status:"Rating 1 Complete"},{"bids.$.status":"Job Complete"},(err,gig)=>{
        if(err){
            console.log(err);
        }
        else if(gig){
           
            res.status(200).send(gig)
        }
    })
    
})

// Change rating

gigRouter.post("/ratingcomplete",(req,res)=>{
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST,PUT, PATCH, DELETE, OPTIONS");
    
    
    gigsterId= req.body.ratingDone.gigsterId;
    gigId= req.body.ratingDone.gigId;
    ownerRating = req.body.ratingDone.ownerRating
    
    Gig.findOneAndUpdate({_id:gigId, status:"Rating 1 Complete"},{status:"Completed"},(err,gig)=>{
        if(err){
            console.log(err);
        }
        else if(gig){

            User.findOne({_id:gig.userId}).then((gigOwner)=>{
                if (gigOwner.rating===null) {
                
                    User.updateOne({_id:gig.userId},{rating:ownerRating},(err,user)=>{
                        if(err){
                            console.log("error while updating rating")
                        }
                        else{
                          
                            res.status(200).send(user)
                        }
                    })
                }
                else{
                    
                    gRating= (gigOwner.rating + parseInt(ownerRating))/2;

                    User.updateOne({_id:gig.userId},{rating:gRating},(err,user)=>{
                        if(err){
                            console.log("error while updating rating")
                        }
                        else{
                           
                            res.status(200).send(user)
                        }
                    }) 
                    
                }
            })
        }
    })
    
})


module.exports = gigRouter