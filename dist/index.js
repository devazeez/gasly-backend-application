"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = require("./routes");
// import { MONGO_URI } from "./config";
// import { connectDb } from "./config/dbConnections"
const treblle = require('@treblle/express');
// const dotenv = require("dotenv").config();
const app = (0, express_1.default)();
const connectDB = async () => {
    try {
        const connectionString = process.env.CONNECTION_STREAM;
        if (!connectionString) {
            throw new Error("Connection string is not defined.");
        }
        const conn = await mongoose_1.default.connect(connectionString);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
app.use(treblle({
    apiKey: process.env.TREBLLE_API_KEY,
    projectId: process.env.TREBLLE_PROJECT_ID,
    additionalFieldsToMask: [],
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/api/admin', routes_1.AdminRoute);
app.use('/api/customer', routes_1.CustomerRoute);
app.use('/api/vendors', routes_1.VendorRoute);
app.use('/api/riders', routes_1.RiderRoute);
app.use('/api/', routes_1.StateRoute);
// app.listen(process.env.PORT, () => {
//     console.clear()
//     console.log(`App is listening to port ${process.env.PORT}`);
// })
connectDB().then(() => {
    app.listen(process.env.PORT || 3000)
});
//# sourceMappingURL=index.js.map