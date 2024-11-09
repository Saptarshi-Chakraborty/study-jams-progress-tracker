"use client";

import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import ParticipantsDetailsBody from "@/component/participantsDetails/Body";
import Head from "next/head";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Dashboard() {
    return (<>
        <Head>
            <title>Participants Details | Study Jams Progress Tracker</title>
            <meta name="description" content="Study Jams Progress Tracker dashboard for Organizers" />
        </Head>

        <Navbar />
        <ParticipantsDetailsBody />
        <Footer />
        <ToastContainer theme='colored' position='top-center' autoClose={2000} />

    </>);
}
