import React from "react";
import Head from "next/head";
import NoSSR from '@mpth/react-no-ssr';


import {
  Card,
} from "antd";
import AgileLayout from "./_layout";

function Page(props: any) {
  const title = "Console / Agile";
  const description = "TODO.";

  return (
    <NoSSR>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Card style={{ marginTop: "14px", minHeight: "100%" }}>
        TODO
      </Card>
    </NoSSR>
  );
}

export default AgileLayout(Page);
