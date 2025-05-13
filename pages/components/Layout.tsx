import Head from "next/head";
import React, { ReactNode } from "react";
import Authenticated from "./Authenticated";
interface layoutProps {
  children: ReactNode;
  PageName: string;
}

const Layout = ({ children, PageName }: layoutProps) => {
  return (
    <Authenticated>
      <main className="layout-container">
        <Head>
          <title>{PageName} - Chat Room</title>
        </Head>
        <div className="children-container">{children}</div>
      </main>
    </Authenticated>
  );
};

export default Layout;
