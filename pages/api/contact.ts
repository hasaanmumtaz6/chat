import { NextApiRequest, NextApiResponse } from "next";
import { Contact } from "@/models/contact";
import { mongooseConnection } from "@/lib/contact";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await mongooseConnection();
    const { method } = req;
    if (method === "GET") {
      const users = await Contact.find();
      return res.status(200).json(users);
    }

    if (method === "POST") {
      const {
        clientName,
        clientEmail,
        messageToClient,
        submitedBy,
        clientId,
        clientAvatar,
        replyOn,
      } = req.body;
      const contact = await Contact.create({
        name: clientName,
        email: clientEmail,
        message: messageToClient,
        clientId: clientId,
        clientAvatar: clientAvatar,
        replyOn,
        submitedBy,
        date: new Date(),
      });
      res.status(200).json(contact);
    }
  } catch (error) {
    console.error("Contact API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
