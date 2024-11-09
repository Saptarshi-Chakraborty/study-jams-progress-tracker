import { ALL_SKILL_BADGES } from '@/utils/allLabs';

const SkillsBadgeDetails = ({ progressReport }) => {
    const allSkillBadges = ALL_SKILL_BADGES;
    
    return (<div className="card mb-3">
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
    </div>)
}

export default SkillsBadgeDetails