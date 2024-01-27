"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose = require("mongoose");
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STREAM, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    }
    catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
    }
};
exports.connectDb = connectDb;
// module.exports = connectDb;
//# sourceMappingURL=dbConnections.js.map