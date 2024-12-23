"use client";

import Footer from '@/component/Footer';
import Navbar from '@/component/Navbar';
import UploadBody from '@/component/upload/UploadBody';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const upload = () => {
    return (<>
        <Head>
            <title>Upload Page | Study Jams Progress Tracker</title>
        </Head>

        <Navbar />
        <UploadBody />
        <Footer />
        <ToastContainer theme='colored' position='top-center' />
    </>);
}

export default upload