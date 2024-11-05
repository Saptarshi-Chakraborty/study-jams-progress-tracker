"use client";

import HomeBody from "@/component/index/Body";
import Navbar from "@/component/Navbar";
import Head from "next/head";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {
  return (<>
    <Head>
      <title>Study Jams Progress Tracker</title>
      <meta name="description" content="Study Jams Progress Tracker" />
    </Head>

    <Navbar />
    <HomeBody />
    <ToastContainer theme='colored' position='top-center' />

  </>);
}
