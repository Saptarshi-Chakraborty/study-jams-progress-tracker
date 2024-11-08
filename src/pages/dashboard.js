"use client";

import DashboardBody from "@/component/dashboard/Body";
import Footer from "@/component/Footer";
import HomeBody from "@/component/index/Body";
import Navbar from "@/component/Navbar";
import Head from "next/head";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Dashboard() {
    return (<>
        <Head>
            <title>Dashboard | Study Jams Progress Tracker</title>
            <meta name="description" content="Study Jams Progress Tracker dashboard for Organizers" />
        </Head>

        <Navbar />
        <DashboardBody />
        <Footer />
        <ToastContainer theme='colored' position='top-center' autoClose={2000} />

    </>);
}
