import { ALL_ARCADE_GAMES } from '@/utils/allLabs'
import React from 'react'

const ArcadeGameDetails = ({ progressReport }) => {
    // console.log("progressReport");
    // console.log(progressReport);

    const allGames = ALL_ARCADE_GAMES;

    return (<div className="card mb-3" >
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
    </div >)
}

export default ArcadeGameDetails