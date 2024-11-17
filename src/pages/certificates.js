"use client";

import CertificatesBody from '@/component/certificates/Body';
import Footer from '@/component/Footer';
import Navbar from '@/component/Navbar';
import Head from 'next/head';
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const upload = () => {


    
    return (<>
        <Head>
            <title>Certificates | Study Jams Progress Tracker</title>
        </Head>

        <Navbar />
        <CertificatesBody />
        <Footer />
        <ToastContainer theme='colored' position='top-center' />
    </>);
}

export default upload