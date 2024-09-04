import mongoose from "mongoose";

require("dotenv").config();
const dbUrl: string = process.env.DB_URI || "";

const connectDb = async () => {
  try {
    await mongoose
      .connect(dbUrl, {
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      })
      .then((data: any) => {
        console.log(`Database connected with ${data.connection.host}`);
      });
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDb, 5000);
  }
};

export default connectDb;
