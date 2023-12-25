import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { VendorRoute, AdminRoute } from "./routes";
import { MONGO_URI } from "./config";

import { connectDb } from "./config/dbConnections"
const dotenv = require("dotenv").config();

connectDb();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// app.use("/", (req,res) => {
//     return res.json("Hello gasly")
// })

app.use('/api/admin', AdminRoute);
app.use('/api/vendors', VendorRoute);

// mongoose.connect(MONGO_URI,{
//     // useNewurlParser: true;
//     useUnifiTopology: true;
//     useCreateIndex: true;
// }).then(result =>{
//     console.log(result)
// }).catch(err => console.log('error'+ err))



app.listen(8000, () => {
    console.clear()
    console.log("App is listening to port 8000");
})  



