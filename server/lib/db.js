import mongoose from "mongoose";

// Connect to MongoDB
export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connection to MongoDB is on");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}}`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
