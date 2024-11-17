import appwrite from '@/utils/appwrite';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify';

const AddCertificateBox = ({ user }) => {
    const router = useRouter();

    const certificateUrlRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [certificate, setCertificate] = useState('');
    const [fileUrl, setFileUrl] = useState('');


    async function uploadCertificate() {
        // Implement certificate upload here
        console.log('Uploading certificate....');

        console.log(certificate);

        const fileName = `GenAI Study Jams 2024 Certificate - ${email} - ${new Date().toDateString()}.pdf`;
        console.log(`fileName: ${fileName}`);
        // change the file name to the above format

        try {
            const result = await appwrite.storage.createFile(
                appwrite.CERTIFICATE_BUCKET_ID, // bucketId
                appwrite.ID.unique(), // fileId
                document.getElementById('certificateTitle').files[0]
                // ["read("any")"] // permissions (optional)
            );

            console.log(result);
            // https://cloud.appwrite.io/v1/storage/buckets/67306cd5001e5b329d9a/files/6730e443002ab182e4ed/view?project=study-jams-progress-tracker

            const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${appwrite.CERTIFICATE_BUCKET_ID}/files/${result.$id}/view?project=${appwrite.PROJECT_ID}`;

            console.log(`File URL: ${fileUrl}`);
            setFileUrl(fileUrl);
            certificateUrlRef.current = fileUrl;

            return true;
        } catch (error) {
            console.error('Failed to upload certificate', error);
            toast.error('Failed to upload certificate');
            return false;
        }

        return false;

    }

    async function onSubmit(e) {
        e.preventDefault();
        if (!email || !certificate) {
            toast.error('Please fill in all fields');
            return;
        };

        const uploadStatus = await uploadCertificate();
        if (!uploadStatus) return;

        // Add certificate data to the database
        try {
            const result = await appwrite.database.createDocument(
                appwrite.DATABASE_ID,
                appwrite.CERTIFICATES_COLLECTION_ID,
                appwrite.ID.unique(),
                {
                    participantsEmail: email,
                    certificateUrl: certificateUrlRef.current,
                    uploadedBy: user.$id,
                }
            );

            console.log(result);
            toast.success('Certificate uploaded successfully');
        } catch (error) {
            console.error('Failed to upload certificate', error);
            toast.error('Failed to upload certificate');
        }
    }


    return (<section className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">

        <h3 className="mt-3">Add Certificates</h3>

        <form className="w-full max-w-lg" onSubmit={onSubmit}>
            <div className="mb-3">
                <label htmlFor="participantsEmail" className="form-label">Participants Email address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control text-lowercase" id="participantsEmail" placeholder="name@example.com" disabled={loading} />
            </div>

            <div className="mb-3">
                <label htmlFor="certificateTitle" className="form-label">Upload Certificate</label>
                <input value={certificate} onChange={(e) => setCertificate(e.target.value)} className="form-control" type="file" id="certificateTitle" multiple={false} disabled={loading} />
            </div>

            <button type="submit" className="btn btn-primary">Add Certificate</button>
        </form>

    </section>)
}

export default AddCertificateBox