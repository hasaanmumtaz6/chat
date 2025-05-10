import Head from "next/head";
import React, { ReactNode } from "react";
interface layoutProps {
  children: ReactNode;
  title: string;
}

const Layout = ({ children, title }: layoutProps) => {
  return (
    <main className="layout-container">
      <Head>
        <title>{title} - Chat Room</title>
      </Head>
      <div className="children-container">{children}</div>
    </main>
  );
};

export default Layout;
