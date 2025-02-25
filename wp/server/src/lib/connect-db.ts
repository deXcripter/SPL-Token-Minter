import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`DB connected: ${conn.connection.host}`);
  } catch (ex) {
    console.log(`Error connecting DB: {url: ${process.env.MONGO_URI}}`);
    process.exit(0);
  }
};

export default connectDB;
