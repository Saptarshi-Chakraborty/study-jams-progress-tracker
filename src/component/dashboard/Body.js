"use client";

import appwrite from '@/utils/appwrite';
import { useRouter } from 'next/router';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import OrganizerNavbar from '../OrganizerNavbar';
import AnalyticsCard from './AnalyticsCard';
import Link from 'next/link';
import ReportsTable from './ReportsTable';

const DashboardBody = () => {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allReports, setAllReports] = useState([]);
    const [hasFetchedReports, setHasFetchedReports] = useState(false);

    async function logout() {
        let session;
        try {
            session = await appwrite.account.get();
            setUser(session);

            router.replace('/upload');
        } catch (error) {
            console.log("User not logged in");
        }

        if (!session) return;

        try {
            await appwrite.account.deleteSession('current');

            setUser(null);
            window.location.reload();
        } catch (error) {
            console.error('Failed to logout', error);
            toast.error('Failed to logout');
        }
    }

    async function checkLogin() {
        if (user) return;
        try {
            setLoading(true);
            const account = await appwrite.account.get();
            console.log(account);

            console.log('User logged in');
            setUser(account);
        } catch (error) {
            console.log(error);
            router.replace('/upload');
            console.log('User not logged in');

        } finally {
            setLoading(false);
        }
    }

    async function fetchAllReports() {
        if (!user) {
            console.log('User not logged in');
            return;
        }

        try {
            setLoading(true);
            const response = await appwrite.database.listDocuments(
                appwrite.DATABASE_ID,
                appwrite.REPORT_DETAILS_COLLECTION_ID,
                [
                    appwrite.Query.equal('uploadedBy', user.$id),
                    appwrite.Query.orderDesc('reportDate'),
                    appwrite.Query.equal('isDeleted', false),
                ]
            );
            console.log(response);
            setAllReports(response.documents);
            setHasFetchedReports(true);
        } catch (error) {
            console.error('Failed to fetch reports', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllReports();
    }, [user]);

    useLayoutEffect(() => {
        checkLogin();
    }, []);


    return (<>
        {
            (user && user.name.length > 3 && user.labels.includes('organizer')) &&
            <OrganizerNavbar user={user} />
        }

        <main className="container my-2">
            <h1 className='text-center fs-2'>Report Overview</h1>

            {
                (user && user.name.length > 3) &&
                <div>
                    <h5>Welcome, {user?.name}</h5>
                    <h6 className="font-monospace">{user?.email}</h6>
                    {
                        user.labels.includes('organizer') &&
                        <span className='badge bg-success small'>Organizer</span>
                    }

                    <button onClick={logout} className='btn btn-danger btn-sm ms-2'>Logout</button>
                </div>
            }

            {
                loading && <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            }

            {
                (!loading && hasFetchedReports && allReports.length === 0) &&
                <div className="alert alert-warning my-3" role="alert">
                    No reports found. Please <Link className="alert-link" href="/upload">upload a report</Link> to view it here.
                </div>
            }

            {/* <button onClick={fetchAllReports} className='btn btn-warning btn-sm  mb-3'>Fetch Reports</button> */}

            {
                (hasFetchedReports && allReports.length > 0) &&
                <>
                    <h3 className="mt-3">Current Status</h3>
                    <AnalyticsCard allReports={allReports} />

                    <h3 className="mt-4">All Uploaded Reports</h3>
                    <ReportsTable allReports={allReports} />
                </>
            }


        </main>

    </>)
}

export default DashboardBody