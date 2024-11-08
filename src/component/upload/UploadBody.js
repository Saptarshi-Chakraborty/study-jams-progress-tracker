"use client";

import { useState } from 'react';
import LoginBox from './LoginBox';
import UploadBox from './UploadBox';
import OrganizerNavbar from '../OrganizerNavbar';

const UploadBody = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    return (<>
        {
            (user && user.name.length > 3 && user.labels.includes('organizer')) &&
            <OrganizerNavbar user={user} />
        }
        <main className="container my-3">
            <h1 className='text-center fs-2'>Upload Daily Report</h1>

            {/* Login Box */}

            <LoginBox user={user} setUser={setUser} />

            {
                (user && user.name.length > 3 && !user.labels.includes('organizer')) &&
                <div className="alert alert-danger my-3" role="alert">
                    Only chapter organizers can upload reports. Contact GDG On Campus FIEM Organizer (<a className="alert-link fw-normal" href="mailto:gdgoncampus.fiem@teamfuture.in">gdgoncampus.fiem@teamfuture.in</a>) to give you permission.
                </div>
            }

            {
                (user && user.name.length > 3 && user.labels.includes('organizer')) &&
                <UploadBox user={user} setUser={setUser} />
            }

            {
                (user === null && loading != true) &&
                <div className='card'>
                    <div className='card-body'>
                        <div className='alert alert-warning my-3'>Please login to upload daily report</div>
                    </div>
                </div>
            }
        </main ></>)
}

export default UploadBody