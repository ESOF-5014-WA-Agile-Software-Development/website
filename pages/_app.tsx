import React from "react";
import {Provider} from "react-redux";

import Head from "next/head";
import type {AppProps} from "next/app";

import store from "@/store/store";
import {Web3Provider} from "@/context/Web3Provider";

import "antd/dist/reset.css";
import "@/styles/antd.custom.css";
import "@/styles/app.css";
import "@/styles/globals.css";


// TODO connect MetaMask manually
function MyApp({Component, pageProps}: AppProps) {
    return (
        <Provider store={store}>
            <Web3Provider>
                <Head>
                    <link rel="icon" type="image/png" href="/favicon.png"/>
                </Head>
                <Component {...pageProps} />
            </Web3Provider>
        </Provider>
    );
}

export default MyApp;
