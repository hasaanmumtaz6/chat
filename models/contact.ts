import { Schema } from "mongoose";

const ContactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  clientId: { type: String },
  clientAvatar: { type: String },
  replyOn: { type: [String] },
  submitedBy: { type: [String], required: true },
  date: Date,
});


export const Contact = models.Contact || model("Contact", ContactSchema);