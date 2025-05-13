import { Schema } from "mongoose";
import { connectToRegisterDB } from "@/lib/dbRegister";

const RegisterSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  colors: { type: [String], required: true },
  date: Date,
});

export async function getRegisterModel() {
  const conn = await connectToRegisterDB();
  return conn.models.Register || conn.model("Register", RegisterSchema);
}
