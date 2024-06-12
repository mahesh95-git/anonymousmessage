import mongoose from "mongoose";
let connection;

export const connect = async () => {
  if (connection) return connection;
  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    connection = db.ConnectionStates[1];
    console.log("connected to mongodb successfully");
    return connection;
  } catch (error) {
    console.log(" unable to connect to mongodb");
    process.exit();
  }
};
