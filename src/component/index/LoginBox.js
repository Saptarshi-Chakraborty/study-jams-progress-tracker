"use client";

import appwrite from '@/utils/appwrite';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { toast } from 'react-toastify';

const LoginBox = ({ user, setUser }) => {
    const [email, setEmail] = useState('')
    const [otp, setOTP] = useState('')
    const [otpSent, setOTPSent] = useState(false)
    const [userId, setUserId] = useState('')
    const [loading, setLoading] = useState(false)

    async function logout() {
        let session;
        try {
            session = await appwrite.account.get();
            console.log("User already logged in", session);

            await appwrite.account.deleteSession('current');
        } catch (error) {
            console.log("User not already logged in");
        }
    }

    async function checkLogin() {
        if (user) return;
        try {
            setLoading(true);
            const account = await appwrite.account.get();
            console.log(account);

            console.log('User already logged in');

            await logout();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function sendOTP(e) {
        e.preventDefault();

        await logout();

        const emailAddress = email.trim().toLowerCase();
        if (!emailAddress) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            const sessionToken = await appwrite.account.createEmailToken(
                appwrite.ID.unique(),
                emailAddress,
            );
            
            console.log(sessionToken);
            toast.success('OTP sent');

            setUserId(sessionToken.userId);
            setOTPSent(true);
        } catch (error) {
            console.log(error);
            toast.error('Failed to send OTP');
            // toast.error(error.message);
            // alert(`${JSON.stringify(Object(error))}`);
        }
    }

    async function verifyOTP(e) {
        e.preventDefault();

        if (!otp) {
            toast.error('Please enter the OTP');
            return;
        }

        if (!userId) {
            toast.error('Invalid user id');
            return;
        }


        try {
            const session = await appwrite.account.createSession(
                userId,
                otp
            );
            console.log(session);
            toast.success('OTP verified');

            const account = await appwrite.account.get();
            console.log(account);

            setUser(account);

            // toast.success('Logged in successfully');
        } catch (error) {
            console.log(error);
            toast.error('Failed to login');
        }

    }

    // useLayoutEffect(() => {
    //     logout();
    // }, [])


    useLayoutEffect(() => {
        checkLogin();
    }, [])

    return (
        <>
            {
                user &&
                <h5>Welcome, {user.email}
                    {/* <button onClick={() => {
                        // logout();
                        window.location.reload();
                    }}className='btn btn-danger btn-sm ms-2'>Logout</button> */}
                </h5>
            }


            {
                (user === null) &&
                <div className='card'>
                    <div className='card-body'>
                        {
                            otpSent ||
                            <form onSubmit={sendOTP}>
                                <div className='mb-3'>
                                    <label className='form-label' htmlFor='email'>Study Jams Email Id</label>
                                    <input value={email} onChange={e => setEmail(e.target.value)} type='text' className='form-control text-lowercase' id='email' placeholder='Enter your study jams registered email id' />
                                    <p className='form-text'>We will send an OTP to this email address</p>
                                </div>
                                <button type='submit' className='btn btn-primary'>Send OTP</button>
                            </form>
                        }


                        {
                            otpSent &&
                            <form onSubmit={verifyOTP}>
                                <div className='alert alert-info py-1'>An OTP has been sent to your email address : <b>{email}</b>. If you can't find it in your inbox, please check your spam folders too.</div>

                                <div className='mb-3'>
                                    <label className='form-label' htmlFor='otp'>Enter the OTP</label>
                                    <input value={otp} onChange={e => setOTP(e.target.value)} type='text' className='form-control' id='otp' placeholder='Enter the OTP sent to your mail' />
                                </div>
                                <button type='submit' className='btn btn-primary'>Login</button>
                            </form>
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default LoginBox