import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <nav className="navbar bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                <Link className="navbar-brand mx-auto" href="/">
                    <img src="/icon.png" alt="Logo" width="30" height="24" className="d-inline-block align-text-top shadow me-1" />

                    <span>Study Jams Progress Checker</span>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar