"use client";

import Link from 'next/link';

const OrganizerNavbar = ({ user }) => {
    return (
        <div className="w-100 bg-dark p-2 d-flex gap-3 align-items-center justify-content-center text-decoration-none ">

            <Link href="/upload" className="link-light fs-6 link-offset-1 link-offset-2-hover mx-2">Upload Report</Link>

            <Link href="/dashboard" className="link-light fs-6 link-offset-1 link-offset-2-hover mx-2">View Report</Link>

            <Link href="/participants-details" className="link-light fs-6 link-offset-1 link-offset-2-hover mx-2">Participants Details</Link>


        </div>
    )
}

export default OrganizerNavbar