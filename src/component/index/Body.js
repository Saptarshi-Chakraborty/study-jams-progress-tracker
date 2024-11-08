"use client";

import appwrite from '@/utils/appwrite';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import LoginBox from './LoginBox';
import ProgressReportBox from './ProgressReportBox';

const HomeBody = () => {
    const [user, setUser] = useState(null);
    const [progressReport, setProgressReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);


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

        // try to get account details
        try {
            const account = await appwrite.account.get();
        } catch (error) {
            console.error('Failed to fetch user account', error);
            toast.error('Failed to fetch user account');
            return;
        }


        // Fetch progress report for the user
        try {
            setHasFetched(false);
            setLoading(true);
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

            setHasFetched(true);

            // logout automatically
            await appwrite.account.deleteSession('current');

        } catch (error) {
            console.error('Failed to fetch progress report', error);
            toast.error("Failed to get you Progress Report. Try Again");
        } finally {
            setLoading(false);
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

        <LoginBox user={user} setUser={setUser} />

        {
            (user && progressReport) && <div >
                <ProgressReportBox user={user} progressReport={progressReport} />
            </div>
        }

        {
            loading && <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        }

        {
            hasFetched && !loading && !progressReport && <div className="text-center">
                {
                    console.log(progressReport)
                }
                <p className='fs-4 my-4 mb-2 text-danger'> No Progress Report Found for <b>{user?.email}</b></p>

                <p className='mb-4'>Contact the GDG On Campus Organizer of your Institution for more info</p>
                <button onClick={() => {
                    setProgressReport(null);
                    fetchProgressReport();
                    window.location.reload();
                }}
                    className="btn btn-warning">Try Again</button>
            </div>
        }

    </main >)
}

export default HomeBody