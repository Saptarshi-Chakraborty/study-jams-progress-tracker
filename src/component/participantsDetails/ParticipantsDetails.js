"use client";

import appwrite from '@/utils/appwrite';
import { useEffect, useState } from 'react';
import ArcadeGameDetails from '../dashboard/ArcadeGameDetails';
import SkillsBadgeDetails from '../dashboard/SkillsBadgeDetails';

const ParticipantsDetails = ({ latestReport }) => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasFetchedParticipants, setHasFetchedParticipants] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    async function fetchParticipants() {
        const participantsLength = parseInt(latestReport.noOfParticipants);
        console.log(`Number of participants: ${participantsLength}`);

        try {
            setLoading(true);
            const response = await appwrite.database.listDocuments(
                appwrite.DATABASE_ID,
                appwrite.REPORT_COLLECTION_ID,
                [
                    appwrite.Query.equal('reportId', latestReport.$id),
                    appwrite.Query.limit(participantsLength),
                    appwrite.Query.orderAsc('name')
                ]
            )

            console.log(response);
            setParticipants(response.documents);
            setHasFetchedParticipants(true);
        } catch (error) {
            console.error('Failed to fetch participants', error);
            toast.error('Failed to fetch participants');
        } finally {
            setLoading(false);
        }
    }

    async function searchParticipants() {
        console.log('searchParticipants');
        const _searchTearm = searchTerm.trim().toLowerCase();

        console.log(`Search Value: (${_searchTearm})`);

        if (_searchTearm === '') {
            setParticipants(participants);
            return;
        }

    }

    useEffect(() => {
        if (latestReport && participants.length === 0)
            fetchParticipants();
    }, [latestReport]);

    return (<div>
        {loading && <div className="text-center fs-5 my-4">Loading...</div>}

        {
            hasFetchedParticipants && participants.length === 0 &&
            <div className="alert alert-info my-3">No participants found</div>
        }

        {/* Search Box */}
        {/* {
            (hasFetchedParticipants && participants.length) > 0 &&
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Search by name or email" value={searhTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <button className="btn btn-primary" type="button" id="button-addon2">Search</button>
            </div>

        } */}

        {(hasFetchedParticipants && participants.length) > 0 &&
            <div className="d-flex flex-row justify-content-between align-items-center mt-2">

                <div>
                    <p className="text-muted mb-0">Press <kbd>Crtl + F</kbd> in keyboard to search for a participant</p>
                </div>

                <button className="btn btn-warning mb-3" onClick={fetchParticipants}>Refresh</button>
            </div>
        }

        {
            (hasFetchedParticipants && participants.length) > 0 &&
            <div className="accordion my-3" id="participantsAccordian">
                {
                    participants.map((participant, index) => {
                        return (
                            <div className="accordion-item" key={participant.$id}>
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#paac${participant.$id}`} aria-expanded="false" aria-controls={`paac${participant.$id}`}>
                                        {participant.name} - {participant.email}
                                        {
                                            participant.codeRedemptionStatus === "Yes" ?
                                                <span className="badge bg-success ms-2 small">Redeemed</span> :
                                                <span className="badge bg-danger ms-2">Not Redeemed</span>
                                        }
                                        <span className="text-primary ms-2">(arcade: {participant.noOfArcadeGamesCompleted})</span>
                                        <span className="text-danger ms-2">(skill badges: {participant.noOfSkillBadgesCompleted})</span>
                                    </button>
                                </h2>

                                <div id={`paac${participant.$id}`} className="accordion-collapse collapse" data-bs-parent="#participantsAccordian">
                                    <div className="accordion-body">
                                        <p className='fs-5 mb-0'>{participant.name}</p>
                                        <p className='fs-6 mb-1 text-black'>{participant.email}</p>
                                        {
                                            participant.codeRedemptionStatus === "Yes" ?
                                                <span className="badge bg-success mb-2">Both Code Redeemed</span> :
                                                <span className="badge bg-danger mb-2">Code Not Redeemed</span>
                                        }

                                        <a href={participant?.profileUrl} target="_blank" className=" ms-2 fs-6">View Public Profile</a>

                                        <ArcadeGameDetails progressReport={participant} />

                                        <SkillsBadgeDetails progressReport={participant} />

                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        }

    </div>)
}

export default ParticipantsDetails