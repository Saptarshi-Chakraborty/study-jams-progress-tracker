"use client";

import appwrite from '@/utils/appwrite';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';

const LoginBox = ({ user, setUser }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [otp, setOTP] = useState('')
    const [otpSent, setOTPSent] = useState(false)
    const [userId, setUserId] = useState('')
    const [loading, setLoading] = useState(false)

    async function logout() {
        let session;
        try {
            session = await appwrite.account.get();
            setUser(session);

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
            toast.success('OTP sent');

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

    async function checkLogin() {
        if (user) return;
        try {
            setLoading(true);
            const account = await appwrite.account.get();
            console.log(account);

            console.log('User already logged in');
            setUser(account);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function changeName(e) {
        e.preventDefault();

        if (!user) {
            toast.error('Please login first');
            return;
        }

        const chapterName = name.trim();
        if (chapterName.length < 3) {
            toast.error('Name cannot be empty');
            return;
        }


        try {
            const result = await appwrite.account.updateName(name);
            console.log(result);
            toast.success('Name updated successfully');

            const account = await appwrite.account.get();
            console.log(account);

            setUser(account);
        } catch (error) {
            console.log(error);
            toast.error('Failed to update name');
        }
    }

    useLayoutEffect(() => {
        checkLogin();
    }, [])

    return (
        <>
            {
                (user && user.name.length > 3) &&
                <div>
                    <h5>Welcome, {user?.name}</h5>
                    <h6 className="font-monospace">{user?.email}</h6>
                    {
                        user.labels.includes('organizer') &&
                        <span className='badge bg-success small ms-2'>Organizer</span>
                    }

                    <button onClick={logout} className='btn btn-danger btn-sm ms-2'>Logout</button>
                </div>
            }

            {
                (user && user.name === '') &&
                <div>
                    <form onSubmit={changeName}>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor='chapter'>Chapter Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} type='text' className='form-control' id='chapter' placeholder='Enter your chapter name' />
                        </div>
                        <button type='submit' className='btn btn-primary'>Submit</button>
                    </form>
                    <div className='alert alert-warning my-3'>Please add your Chapter Name to proceess further</div>
                </div>
            }


            {
                (user === null && loading != true) &&
                <div className='card'>
                    <div className='card-body'>
                        {
                            otpSent ||
                            <form onSubmit={sendOTP}>
                                <div className='mb-3'>
                                    <label className='form-label' htmlFor='username'>Organizer's Primary Email Id</label>
                                    <input value={email} onChange={e => setEmail(e.target.value)} type='text' className='form-control' id='username' placeholder='Enter your primary email id' />
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

                    <div className='card-footer'>
                        This page is only for partnered GDG On Campus Organizers. If you are not an Chapter Organizer, please close this page.
                    </div>
                </div>
            }
        </>
    )
}

export default LoginBox