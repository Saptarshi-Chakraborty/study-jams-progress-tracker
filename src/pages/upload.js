"use client";

import Navbar from '@/component/Navbar';
import UploadBody from '@/component/upload/UploadBody';
import UploadPageBody from '@/component/upload/UploadBox';
import Head from 'next/head';
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const upload = () => {
    return (<>
        <Head>
            <title>Upload Page | Study Jams Progress Tracker</title>
        </Head>

        <Navbar />
        <UploadBody />
        <ToastContainer theme='colored' position='top-center' />
    </>);
}

export default upload