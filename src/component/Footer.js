"use client";

import Link from 'next/link';

const Footer = () => {
    return (<div className='container my-3 text-center'>
        {/* <p className='text-center'>
            *Disclaimer : This is a personal project and is not affiliated with Google or Google Cloud or Study Jams Officials.
        </p> */}

        <hr className="" />

        <p className='mb-1'>Made with 💙 by {" "}
            <a className="link-danger link-offset-2 link-offset-3-hover link-underline-opacity-25 link-underline-opacity-100-hover" href="https://linktr.ee/gdgoncampus.fiem" target="_blank">GDG On Campus FIEM</a>
        </p>
        <p>
            <Link className="link-success link-offset-2 link-offset-3-hover link-underline-opacity-25 link-underline-opacity-100-hover" href="mailto:gdgoncampus.fiem@teamfuture.in?subject=Study Jams Progress Tracker&body=Hi Team, I am facing an issue with Study Jams Progress Tracker. Kindly help me with this.   ">Email Us</Link>
            {" "} | {" "}
            <span className='text-primary'>
                &copy; {new Date().getFullYear()}{" "}
            </span>
            |{" "}
            <a className="link-dark link-offset-2 link-offset-3-hover link-underline-opacity-25 link-underline-opacity-100-hover" href="https://github.com/Saptarshi-Chakraborty/study-jams-progress-tracker" target='_blank'>Source Code</a>
        </p>
    </div>)
}

export default Footer