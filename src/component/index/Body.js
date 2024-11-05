"use client";

import React, { useEffect, useLayoutEffect, useState } from 'react'
import LoginBox from './LoginBox'
import appwrite from '@/utils/appwrite';
import ProgressReportBox from './ProgressReportBox';
import { toast } from 'react-toastify';

const HomeBody = () => {
    const [user, setUser] = useState(null);
    const [progressReport, setProgressReport] = useState(null);


    async function fetchUserAccount() {
        try {
            const account = await appwrite.account.get();
            setUser(account);
        } catch (error) {
            console.error('Failed to fetch user account', error);
        }
    }


    const fetchProgressReport = async () => {
        if (!user || user.email === undefined) return;
        if (progressReport) return;

        console.log('Fetching progress report');

        const email = user.email.trim();

        // Fetch progress report for the user
        try {
            const result = await appwrite.database.listDocuments(
                appwrite.DATABASE_ID,
                appwrite.REPORT_COLLECTION_ID,
                [
                    appwrite.Query.equal('email', email),
                    appwrite.Query.orderDesc('reportDate'),
                    appwrite.Query.limit(1),
                ]
            );

            console.log(result);
            setProgressReport(result.documents[0]);
            // toast.success('Progress report fetched successfully');

            // logout automatically
            await appwrite.account.deleteSession('current');

        } catch (error) {
            console.error('Failed to fetch progress report', error);
            toast.error("Failed to get you Progress Report. Try Again");
        }
    }

    async function logout() {
        try {
            await appwrite.account.deleteSession('current');
            setUser(null);
            setProgressReport(null);
            toast.success('Logged out successfully');

            // reload page
            window.location.reload();
        } catch (error) {
            console.error('Failed to logout', error);
            toast.error('Failed to logout');
        }
    }

    useEffect(() => {
        if (user) {
            console.log('User found,', user.email);
            fetchProgressReport();
        }
    }, [user]);

    // useLayoutEffect(() => {
    //     fetchUserAccount();
    // }, []);

    return (<main className="container my-3">
        <h1 className='text-center fs-3'>Check Your GenAI Study Jams 2024 Progress </h1>

        {/* Login Box */}
        {
            !user &&
            <LoginBox user={user} setUser={setUser} />
        }

        {
            (user && progressReport) && <div div >
                <h4>Welcome, {user.email} <button onClick={logout} className="btn btn-danger btn-sm">Logout</button></h4>
                
                <ProgressReportBox user={user} progressReport={progressReport} />
            </div>
        }




    </main >)
}

export default HomeBody