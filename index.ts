import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { VendorRoute, AdminRoute } from "./routes";
import { MONGO_URI } from "./config";

import { connectDb } from "./config/dbConnections"
import { StateRoute } from "./routes/statesAndLgaRoutes";
const dotenv = require("dotenv").config();

connectDb();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/api/admin', AdminRoute);
app.use('/api/vendors', VendorRoute);
app.use('/api/', StateRoute);





app.listen(process.env.PORT, () => {
    console.clear()
    console.log(`App is listening to port ${process.env.PORT}`);
})



