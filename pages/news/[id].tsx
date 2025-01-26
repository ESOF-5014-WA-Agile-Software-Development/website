import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import AgileLayout from "../_layout";


function Banner(props: any) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div
        style={{
          fontSize: "4rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        Loading...
      </div>
    );
  }

  const NewsDetail = () => {
    return (
      <>
          TODO
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Agile</title>
        <meta name="description" content="Agile" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <NewsDetail />
    </>
  );
}

export default AgileLayout(Banner);
