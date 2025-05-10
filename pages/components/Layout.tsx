import Head from "next/head";
import React, { ReactNode } from "react";
interface layoutProps {
  children: ReactNode;
  PageName: string;
}

const Layout = ({ children, PageName }: layoutProps) => {
  return (
    <main className="layout-container">
      <Head>
        <title>{PageName} - Chat Room</title>
      </Head>
      <div className="children-container">{children}</div>
    </main>
  );
};

export default Layout;
