import mongoose from "mongoose";

let registerConn: mongoose.Connection | null = null;

export async function connectToRegisterDB() {
  if (registerConn && registerConn.readyState === 1) return registerConn;

  const uri = process.env.MONGODB_REGISTER_URI as string;
  if (!uri) throw new Error("Missing MONGODB_REGISTER_URI");

  const conn = await mongoose.createConnection(uri).asPromise();
  registerConn = conn;
  return registerConn;
}
