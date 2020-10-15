require('dotenv').config();
const express = require("express");
const bodyParser= require('body-parser');
const cors = require('cors');
const PORT = 3000;
const encrypt = require("mongoose-encryption")
const md5 = require("md5")

const app = express();
const userAPI = require("./routes/userAPI")
const gigAPI = require("./routes/gigAPI")
const adminAPI= require("./routes/adminAPI")
app.use(bodyParser.json());

app.use(cors());

app.use("/adminAPI", adminAPI)
app.use('/userAPI',userAPI)
app.use("/gigAPI" , gigAPI)
// app.use("/adminAPI", adminAPI)


app.listen(PORT, ()=>{
    console.log("You have arrived at Port " + PORT);
})
