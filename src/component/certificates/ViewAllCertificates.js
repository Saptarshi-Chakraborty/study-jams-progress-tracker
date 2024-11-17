import appwrite from '@/utils/appwrite';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const ViewAllCertificates = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);

    async function fetchAllCertificates() {
        if (!user) {
            console.error('User not logged in');
            toast.error('User not logged in');
            return;
        }

        try {
            setLoading(true);
            const response = await appwrite.database.listDocuments(
                appwrite.DATABASE_ID,
                appwrite.CERTIFICATES_COLLECTION_ID,
                [
                    appwrite.Query.equal('uploadedBy', user.$id),
                    appwrite.Query.orderDesc('$createdAt'),
                    appwrite.Query.limit(100)
                ]
            );

            console.log(response);
            // toast.success('Certificates fetched successfully');
            setCertificates(response.documents);
            setHasFetched(true);

        } catch (error) {
            console.error('Failed to fetch certificates', error);
            toast.error('Failed to fetch certificates');
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="mb-3">
            <h3 className="mt-3">View All Certificates</h3>

            <button className="btn btn-warning btn-sm" onClick={fetchAllCertificates}>Refresh</button>

            {loading && <span>Loading...</span>}
            {error && <p className="alert alert-danger my-3">{error.message}</p>}

            {hasFetched && certificates.length === 0 &&
                <div className="alert alert-warning my-3">No certificates found</div>
            }

            {
                (hasFetched && certificates.length > 0) &&
                <table className="table table-bordered table-striped mt-2">
                    <thead className='table-primary' data-bs-theme="dark">
                        <tr>
                            <th>#</th>
                            <th>Participants Email</th>
                            <th>Certificate URL</th>
                            <th>Upload Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificates.map((certificate, index) => (
                            <tr key={certificate.$id}>
                                <td>{index + 1}</td>
                                <td>{certificate.participantsEmail}</td>
                                <td><a className="btn btn-primary btn-sm" href={certificate.certificateUrl} target="_blank" rel="noreferrer">View Certificate</a></td>
                                <td>{new Date(certificate.$createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }


        </section>
    )
}

export default ViewAllCertificates