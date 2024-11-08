"use client";

import Footer from "@/component/Footer";
import HomeBody from "@/component/index/Body";
import Navbar from "@/component/Navbar";
import Head from "next/head";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {
  return (<>
    <Head>
      <title>Study Jams Progress Tracker</title>
      <meta name="description" content="Check your own latest Study Jams progress report in detail." />
      <meta name="keywords" content="Study Jams, Progress Tracker, Study Jams Progress Tracker, Study Jams Tracker, Study Jams Progress" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/icon.png" />
      

      <meta property="og:title" content="Study Jams Progress Tracker" />
      <meta property="og:description" content="Check your own latest Study Jams progress report in detail." />
      <meta property="og:image" content="/icon.png" />
      <meta property="og:url" content="https://study-jams-progress.pages.dev" />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="Study Jams Progress Tracker" />
      <meta name="twitter:description" content="Check your own latest Study Jams progress report in detail." />
      <meta name="twitter:image" content="/icon.png" />
      <meta name="twitter:url" content="https://study-jams-progress.pages.dev" />

    </Head>

    <Navbar />
    <HomeBody />
    <Footer />
    <ToastContainer theme='colored' position='top-center' autoClose={2000} />

  </>);
}
