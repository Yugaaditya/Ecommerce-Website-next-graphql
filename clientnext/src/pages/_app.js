import React, { useEffect, useReducer, useState } from 'react';
import Navbar from "@/components/Navbar/Navbar";
import "@/styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import { DarkModeContext } from "@/context/DarkModeContext";
import ThemeReducer from "@/reducer/ThemeReducer";
import { ApolloProvider } from '@apollo/client';
import client from '../apollo';

export default function App({ Component, pageProps }) {
  const [LoginStatus, setLoginStatus] = useState(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return token ? "Logout" : "Login";
    }
    return "Login";
  });
  const [sortType, setSorting] = useState(null);
  const [rating, setRating] = useState(null)
  const [category, setCategory] = useState(null)
  const [search, setSearch] = useState("")
  const [theme, dispatch] = useReducer(ThemeReducer, "Dark")
  return (
    <ApolloProvider client={client}>
      <DarkModeContext.Provider value={theme}>
        <div>
          <Head>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous" />
          </Head>
          <Navbar LoginStatus={LoginStatus} setLoginStatus={setLoginStatus} setSorting={setSorting} setRating={setRating} setCategory={setCategory} search={search} setSearch={setSearch} theme={theme} dispatch={dispatch} />
          <Component {...pageProps} LoginStatus={LoginStatus} setLoginStatus={setLoginStatus} sortType={sortType} rating={rating} category={category} search={search} />;
          <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></Script>
        </div>
      </DarkModeContext.Provider>
    </ApolloProvider>
  )
}
