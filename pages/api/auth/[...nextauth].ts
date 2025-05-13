import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import { connectToRegisterDB } from "@/lib/dbRegister";
import { getRegisterModel } from "@/models/register";
import CredentialsProvider from "next-auth/providers/credentials";

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"username" | "password", string> | undefined
      ): Promise<User | null> {
        if (!credentials) return null;

        await connectToRegisterDB();
        const Register = await getRegisterModel();
        try {
          const user = await Register.findOne({
            username: credentials.username,
          });

          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isPasswordCorrect) {
              return {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                password: user.password,
              };
            }
          }

          return null;
        } catch (err) {
          throw new Error(err instanceof Error ? err.message : "Unknown error");
        }
      },
    }),
  ],
});
