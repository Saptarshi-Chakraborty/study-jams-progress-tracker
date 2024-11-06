import { ALL_ARCADE_GAMES, ALL_SKILL_BADGES } from '@/utils/allLabs';
import appwrite from '@/utils/appwrite';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const ProgressReportBox = ({ user, progressReport }) => {

    console.log("progressReport");
    console.log(progressReport);

    const reportDate = new Date(progressReport.reportDate);

    const allGames = ALL_ARCADE_GAMES;
    const allSkillBadges = ALL_SKILL_BADGES;


    return (
        <div>
            <Link href={progressReport.profileUrl} className="fs-5 link-primary link-offset-2" target="_blank">Your Profile URL</Link>
            <p className="text-muted my-1">Last Updated On: <span className='fw-bold text-dark'>{reportDate.toDateString()}</span></p>


            <p>Both Access Code Redeemed: {progressReport?.codeRedemptionStatus == "Yes" ?
                <span className="badge bg-success">Yes</span> : <span className="badge bg-danger">No</span>
            }</p>

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
                (progressReport?.codeRedemptionStatus == "Yes" && progressReport.noOfArcadeGamesCompleted == 1 && progressReport.noOfSkillBadgesCompleted == 15) &&
                <div className="alert alert-success">Congratulations! 🎉 You have completed all the requirements for the GenAI Study Jams 2024 🚀</div>
            }

        </div >
    )
}

export default ProgressReportBox