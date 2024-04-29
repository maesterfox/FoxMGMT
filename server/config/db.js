require("dotenv").config(); // Ensure this is at the top if you're using dotenv
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
console.log(process.env.MONGO_URI); // This will print the value of MONGO_URI

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection.db; // Return the database connection
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
