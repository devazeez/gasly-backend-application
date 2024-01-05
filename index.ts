import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { VendorRoute, AdminRoute, CustomerRoute, StateRoute, RiderRoute } from "./routes";
import { MONGO_URI } from "./config";
import { connectDb } from "./config/dbConnections"

const dotenv = require("dotenv").config();



// connectDb();


const app = express();

const connectDB = async () => {
    try {
        const connectionString = process.env.CONNECTION_STREAM;
        if (!connectionString) {
            throw new Error("Connection string is not defined.");
        }

        const conn = await mongoose.connect(connectionString);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/api/admin', AdminRoute);
app.use('/api/customer', CustomerRoute);
app.use('/api/vendors', VendorRoute);
app.use('/api/riders', RiderRoute);
app.use('/api/', StateRoute);





// app.listen(process.env.PORT, () => {
//     console.clear()
//     console.log(`App is listening to port ${process.env.PORT}`);
// })

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`listening for requests at port ${process.env.PORT}`);
    })
})



// import express from "express";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// const { MongoClient } = require('mongodb');

// import { VendorRoute, AdminRoute } from "./routes";
// import { MONGO_URI } from "./config";

// import { connectDb } from "./config/dbConnections"
// import { StateRoute } from "./routes/statesAndLgaRoutes";
// import { RiderRoute } from "./routes/riderRoutes";
// const dotenv = require("dotenv").config();

// const uri = process.env.CONNECTION_STREAM;
// const client = new MongoClient(uri);


// // connectDb();
// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));



// app.use('/api/admin', AdminRoute);
// app.use('/api/vendors', VendorRoute);
// app.use('/api/riders', RiderRoute);
// app.use('/api/', StateRoute);





// client.connect((err: any) => {
//     if (err) { 
//         console.error(err); 
//         return false;
//     }
//     // connection to mongo is successful, listen for requests
//     app.listen(process.env.PORT, () => {
//         console.log("listening for requests");
//     });
// });




