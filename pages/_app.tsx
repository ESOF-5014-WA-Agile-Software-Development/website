import "antd/dist/antd.css";

import "../styles/antd.custom.css";
import "../styles/agile.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import React from "react";
import { Provider } from "react-redux";

import store from "../store/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
