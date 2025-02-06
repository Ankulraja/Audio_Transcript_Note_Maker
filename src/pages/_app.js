import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme";
import "../styles/global.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";

export default function MyApp(props) {
  const { Component, pageProps } = props;

  return (
    <AppCacheProvider {...props}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Note Maker App</title>
        <meta name="description" content="Sethi Estate Agency" />
      </Head>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthProvider>
    </AppCacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};