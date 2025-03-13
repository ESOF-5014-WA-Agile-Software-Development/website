import React from "react";
import { Provider } from "react-redux";

import type { AppProps } from "next/app";
// import dynamic from "next/dynamic";

import store from "@/store/store";
import { Web3Provider } from "@/context/Web3Provider";

import "antd/dist/reset.css";
import "@/styles/antd.custom.css";
import "@/styles/app.css";
import "@/styles/globals.css";


// TODO connect MetaMask manually
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
        <Web3Provider>
            <Component {...pageProps} />
        </Web3Provider>
    </Provider>
  );
}

export default MyApp;

/*
export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
 */
