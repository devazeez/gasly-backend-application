const mongoose = require ("mongoose")
// import { Mongoose } from "mongoose";

// export const connectDb = async () => {
//     try{
//         console.log("AZEEZ")
//         const connect = await mongoose.connect(process.env.CONNECTION_STREAM)
//         console.log("Database is now connected: ", connect.connection.name);
//     }catch (err){
//         console.log(err);
//         process.exit(1);
//     }
// }


// export const connectDb = async () => {
//     try {
//       await mongoose.connect(process.env.CONNECTION_STREAM, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
//       console.log('Connected to MongoDB');
//     } catch (err) {
//       console.error('Error connecting to MongoDB:', err.message);
//     }
//   };

  export const connectDb = async () => {
    try {
      await mongoose.connect(process.env.CONNECTION_STREAM, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (err: any) {
      console.error('Error connecting to MongoDB:', err.message);
    }
  };
  
// module.exports = connectDb;