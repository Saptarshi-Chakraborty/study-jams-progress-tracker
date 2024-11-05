"use client";

import appwrite from '@/utils/appwrite';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { toast } from 'react-toastify';

const LoginBox = ({ user, setUser }) => {
    const [email, setEmail] = useState('')
    const [otp, setOTP] = useState('')
    const [otpSent, setOTPSent] = useState(false)
    const [userId, setUserId] = useState('')

    async function logout() {
        try {
            const session = await appwrite.account.get();
            if (!session) return; 
            await appwrite.account.deleteSession('current');
        } catch (error) {
            console.error('Failed to logout', error);
            toast.error('Failed to logout');
        }
    }

    async function sendOTP(e) {
        e.preventDefault();

        const emailAddress = email.trim();
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
            toast.success('OTP sent successfully');

            setUserId(sessionToken.userId);
            setOTPSent(true);
        } catch (error) {
            console.log(error);
            toast.error('Failed to send OTP');
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

    useLayoutEffect(() => {
        logout();
    }, [])

    return (
        <div className='card'>
            <div className='card-body'>
                {
                    otpSent ||
                    <form onSubmit={sendOTP}>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor='username'>Study Jams Email Id</label>
                            <input value={email} onChange={e => setEmail(e.target.value)} type='text' className='form-control' id='username' placeholder='Enter your study jams registered email id' />
                            <p className='form-text'>We will send an OTP to this email id</p>
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
    )
}

export default LoginBox