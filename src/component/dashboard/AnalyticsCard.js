"use client";

const AnalyticsCard = ({ allReports }) => {
    return (<div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-2">
        <div className="col">
            <div className="card h-100">
                <div className="card-body">
                    <h1 className="card-title">{allReports[0]['noOfParticipants']}</h1>
                    <h5 className="card-text">Total Participants</h5>
                </div>
            </div>
        </div>
        <div className="col mt-md-4 mt-2">
            <div className="card h-100">
                <div className="card-body">
                    <h1 className="card-title">{allReports[0]['noOfSkillsBageCompletion']}</h1>
                    <h5 className="card-text">Skills Badges Completed</h5>
                </div>
            </div>
        </div>
        <div className="col mt-md-4 mt-2">
            <div className="card h-100">
                <div className="card-body">
                    <h1 className="card-title">{allReports[0]['noOfArcadeGamesCompletion']}</h1>
                    <h5 className="card-text">Arcade Game Completed</h5>
                </div>
            </div>
        </div>
        <div className="col mt-md-4 mt-2">
            <div className="card h-100">
                <div className="card-body">
                    <h1 className="card-title">{allReports[0]['noOfAllCompleted']}</h1>
                    <h5 className="card-text">All Completed</h5>
                </div>
            </div>
        </div>
    </div>)
}

export default AnalyticsCard