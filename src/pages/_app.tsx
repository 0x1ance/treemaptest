import "../styles/globals.css";
import type { AppProps } from "next/app";

import React, { Fragment } from "react";
import Head from "next/head";
import { SizeObserverProvider } from "../context/useSizeObserver";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Head>
        <title>Treemap Generator</title>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="vercel.svg" />
        <link rel="apple-touch-icon" sizes="150x150" href="favicon.ico" />
      </Head>

      <SizeObserverProvider>
        <Component {...pageProps} />
      </SizeObserverProvider>
    </Fragment>
  );
}

export default MyApp;
