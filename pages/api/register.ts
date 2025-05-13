import { NextApiRequest, NextApiResponse } from "next";
import { getRegisterModel } from "@/models/register";
export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: "15000mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const Register = await getRegisterModel();

    if (req.method === "GET") {
      const users = await Register.find();
      return res.status(200).json(users);
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
