import { ALL_ARCADE_GAMES, ALL_SKILL_BADGES } from '@/utils/allLabs';
import appwrite from '@/utils/appwrite';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import MyCertificates from './MyCertificates';

const ProgressReportBox = ({ user, progressReport }) => {

    console.log("progressReport");
    console.log(progressReport);

    const reportDate = new Date(progressReport.reportDate);

    const allGames = ALL_ARCADE_GAMES;
    const allSkillBadges = ALL_SKILL_BADGES;

    async function shareToSocialMedia() {
        const shareData = {
            title: 'GenAI Study Jams 2024 Progress Report',
            text: 'Check out your progress report for GenAI Study Jams 2024',
            url: "https://study-jams-progress.pages.dev",
        };

        try {
            await navigator.share(shareData);
        } catch (error) {
            console.error('Failed to share', error);
            toast.error('Failed to share');
        }
    }

    return (
        <div>
            <Link href={progressReport.profileUrl} className="fs-5 link-primary link-offset-2" target="_blank">Your Public Profile</Link>
            <p className=" my-1">Report Last Updated On: <span className='fw-bold text-dark'>{reportDate.toDateString()}</span></p>


            <p>Both Access Code Redeemed: {progressReport?.codeRedemptionStatus == "Yes" ?
                <span className="badge bg-success">Yes</span> : <span className="badge bg-danger">No</span>
            }</p>

            <p>
                <button onClick={shareToSocialMedia} className='btn btn-primary fs-6 py-1 px-3 rounded-pill'>Share</button>
            </p>

            {/* All Completed Congratulations Message */}
            {
                (progressReport?.codeRedemptionStatus == "Yes" && Number(progressReport.noOfArcadeGamesCompleted) >= 1 && progressReport.noOfSkillBadgesCompleted == 15) &&
                <div className="alert alert-success">Congratulations! 🎉 You have completed all the requirements for the GenAI Study Jams 2024 🚀</div>
            }

            {/* Arcade Game Progress */}
            <div className="card mb-3">
                <div className="card-header">
                    <h5 className="card-title">Arcade Game</h5>
                    <p className="card-text">completed: {progressReport.noOfArcadeGamesCompleted}/1</p>
                </div>

                <div className="card-body">
                    {
                        allGames.map((game, index) => {
                            return (
                                <div key={index} className="d-flex align-items-center justify-content-between">
                                    <p className="card-text">{game.name}</p>
                                    {
                                        progressReport.arcadeGamesCompleted.includes(game.name) ?
                                            <span className="badge bg-success">Completed</span> :
                                            <span className="badge bg-danger">Not Completed</span>
                                    }
                                </div>
                            )
                        })
                    }
                    <p className="mb-0 text-primary fw-bold">Note: Any one completion of these two is counted.</p>
                </div>
            </div>

            {/* Skill Badges Progress */}
            <div className="card mb-3">
                <div className="card-header">
                    <h5 className="card-title">Skills Boost Badges</h5>
                    <p className="card-text">completed: {progressReport.noOfSkillBadgesCompleted}/15</p>
                </div>

                <div className="card-body">
                    {
                        allSkillBadges.map((game, index) => {
                            return (
                                <div key={index} className="d-flex align-items-center justify-content-between">
                                    <p className="card-text">{game.name}</p>
                                    {
                                        progressReport.completedSkillBadges.includes(game.name) ?
                                            <span className="badge bg-success">Completed</span> :
                                            <span className="badge bg-danger">Not Completed</span>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            
            {
                (progressReport?.chapterName) &&
                <MyCertificates email={progressReport.email} />
            }

            {
                (progressReport?.chapterName) &&
                <p className="my-2 fs-6">You are registered under the chapter:{" "}
                    <span className="text-dark fs-5 fw-semibold">{progressReport.chapterName}</span>
                </p>

            }

        </div >
    )
}

export default ProgressReportBox