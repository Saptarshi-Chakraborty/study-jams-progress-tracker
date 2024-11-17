import appwrite from '@/utils/appwrite';
import React, { useEffect, useState } from 'react'

const MyCertificates = ({ email }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [hasFetched, setHasFetched] = useState(false);

    async function getCertificates() {
        try {
            setLoading(true);
            const response = await appwrite.database.listDocuments(
                appwrite.DATABASE_ID,
                appwrite.CERTIFICATES_COLLECTION_ID,
                [
                    appwrite.Query.equal('participantsEmail', email)
                ]
            )
            console.log(response);
            setHasFetched(true);
            setCertificates(response.documents);
        } catch (error) {
            console.error('Failed to get certificates', error);
            toast.error('Failed to get certificates');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCertificates();
    }, [email])


    return (<section>
        {/* <button onClick={getCertificates} className='btn btn-primary fs-6 py-1 px-3 rounded-pill'>Refresh Certificates</button> */}
        {(loading) && <div>Loading...</div>}

        {
            (hasFetched && certificates.length > 0) &&
            <div>
                <h2>My Certificates</h2>
                {
                    certificates.map(certificate => (
                        <div key={certificate.$id} className="mb-2 border rounded rounded-2 px-4 py-2">
                            <a href={certificate.certificateUrl} target="_blank" className="fs-5 link-primary link-offset-2">View Certificate</a>
                            {/* Download  */}
                            
                            <p className="mb-0">Issued On: {new Date(certificate.$createdAt).toDateString()}</p>
                        </div>
                    ))
                }

            </div>
        }


    </section >)
}

export default MyCertificates