import appwrite from '@/utils/appwrite';
import { useRouter } from 'next/router';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import OrganizerNavbar from '../OrganizerNavbar';
import AddCertificateBox from './AddCertificateBox';
import ViewAllCertificates from './ViewAllCertificates';

const CertificatesBody = () => {

    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        // fetchAllReports();
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
            <h1 className='text-center fs-2'>Certificates</h1>

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
                (user && user.name.length > 3) && <>
                    <AddCertificateBox user={user} />
                    <ViewAllCertificates user={user} />
                </>
            }



        </main>
    </>);
}

export default CertificatesBody