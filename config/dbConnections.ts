const mongoose = require ("mongoose")

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