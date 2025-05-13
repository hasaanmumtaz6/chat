import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import { FaLock, FaUser } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const session = useSession();
  const [error, setError] = useState<string>("");
  
  useEffect(() => {
    if (session?.status === "authenticated") {
      router.replace("/");
    }
  }, [session, router]);

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = (e.target as HTMLFormElement)[0] as HTMLInputElement;
    const password = (e.target as HTMLFormElement)[1] as HTMLInputElement;

    const usernameValue = username.value;
    const passwordValue = password.value;

    if (!usernameValue) {
      setError("Username is invalid");
      setTimeout(() => setError(""), 10000);
      return;
    }

    if (!passwordValue || passwordValue.length < 6) {
      setError("Password is invalid");
      setTimeout(() => setError(""), 10000);
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      username: usernameValue,
      password: passwordValue,
    });

    if (res?.error) {
      setError("Invalid Username or password");
      setTimeout(() => setError(""), 10000);
    } else if (res?.url) {
      router.replace("/");
    }
  };

  return (
    <main className="Sign-In-page-container">
      <Head>
        <title>Sign In - Admin Panel</title>
      </Head>
      <div className="Sign-In-page-box">
        <div className="sign-form">
          <div className="name_comp flex items-center gap-2">
            <Image
              src={logo}
              alt="logo-admin-panel"
              className="w-[2.25rem] h-auto"
            />
            <p>Chat Room</p>
          </div>
          
          <form className="sign-in-form" onSubmit={login}>
            <label htmlFor="username">
              <FaUser />
              <input type="text" id="username" placeholder="User Name" />
            </label>
            <label htmlFor="password">
              <FaLock />
              <input type="password" id="password" placeholder="Password" />
            </label>
            <button className="sign-in-btn" type="submit">
              Sign In
            </button>
          </form>

          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>
    </main>
  );
};

export default Login;
