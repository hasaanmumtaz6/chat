import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import Loader from "./Loader";
import Head from "next/head";

interface propsType {
  children: ReactNode;
}

const Authenticated = ({ children }: propsType) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading")
    return (
      <div className="flex items-center flex-col justify-center min-h-screen">
        <Head>
          <title>Loading....</title>
        </Head>
        <Loader />
      </div>
    );

  return <>{children}</>;
};

export default Authenticated;
