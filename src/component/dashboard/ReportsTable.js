"use client";

import appwrite from '@/utils/appwrite';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ReportsTable = ({ allReports }) => {
    const [loading, setLoading] = useState(false);

    function calcChange(oldValue, newValue) {
        // return "";
        if (!oldValue || oldValue == 0) return "";
        const change = parseInt(newValue) - parseInt(oldValue);
        console.log(`oldValue: ${oldValue}, newValue: ${newValue}, change: ${change}`);

        if (change == 0) {
            return <span className='text-primary'> (+ 0)</span>;
        } else if (change > 0) {
            return <span className='text-success'> (+ ${change})</span>;
        } else {
            return <span className='text-danger'> (- ${change})</span>;
        }
        return " (---)"
    }


    async function deleteReport(reportId) {
        const confirm = window.confirm('Are you sure you want to delete this report?\nAll the records associated with this report will be deleted as well');

        if (!confirm) return;

        const report = allReports.find(report => report.$id === reportId);
        console.log(report);
        if (!report) {
            toast.error('Report not found');
            return;
        }
        // return;

        try {
            setLoading(true);

            // delete report details
            const reportDetailsDeleteResponse = await appwrite.database.deleteDocument(
                appwrite.DATABASE_ID,
                appwrite.REPORT_DETAILS_COLLECTION_ID,
                reportId,
            );
            console.log(reportDetailsDeleteResponse);

            // // delete records associated with the report
            // const recordsDeleteResponse = await appwrite.database.deleteDocument(
            //     appwrite.DATABASE_ID,
            //     appwrite.REPORT_COLLECTION_ID,
            //     [
            //         appwrite.Query.equal('reportId', reportId)
            //     ]
            // );

            // console.log(recordsDeleteResponse);

            toast.success('Report deleted successfully');
        } catch (error) {
            console.error('Failed to delete report', error);
            toast.error('Failed to delete report');
        } finally {
            setLoading(false);
        }
    }

    return (<div className="table-responsive">
        <table className="table table-striped table-hover mb-2">
            <thead className="table-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Report Date</th>
                    <th scope="col">Arcade Completed</th>
                    <th scope="col">Skill Badges Completed</th>
                    <th scope="col">All Completed</th>
                    {/* <th scope="col">Actions</th> */}
                </tr>
            </thead>
            <tbody>
                {
                    allReports.map((report, index) => (
                        <tr key={report.$id}>
                            <th scope="row">{index + 1}</th>
                            <td>{new Date(report.reportDate).toDateString()}</td>
                            <td>{report.noOfArcadeGamesCompletion}
                                <DifferenceMarker oldValue={allReports[index + 1]?.noOfArcadeGamesCompletion} newValue={report.noOfArcadeGamesCompletion} />
                            </td>
                            <td>{report.noOfSkillsBageCompletion}
                                <DifferenceMarker oldValue={allReports[index + 1]?.noOfSkillsBageCompletion} newValue={report.noOfSkillsBageCompletion} />
                            </td>
                            <td>{report.noOfAllCompleted}
                                <DifferenceMarker oldValue={allReports[index + 1]?.noOfAllCompleted} newValue={report.noOfAllCompleted} />
                            </td>
                            {/* <td>
                            <button onClick={() => deleteReport(report.$id)}
                                className='btn btn-sm btn-danger' disabled={loading}>Delete Report</button>
                        </td> */}
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>)
}

const DifferenceMarker = ({ oldValue, newValue }) => {
    if (!oldValue || oldValue == 0) return "";
    const change = parseInt(newValue) - parseInt(oldValue);
    // console.log(`oldValue: ${oldValue}, newValue: ${newValue}, change: ${change}`);

    if (change == 0) {
        return <span className='text-primary'> (+0)</span>;
    } else if (change > 0) {
        return <span className='text-success'> (+{change})</span>
    } else {
        return <span className='text-danger'> ({change})</span>;
    }
    return " (---)"
}



export default ReportsTable