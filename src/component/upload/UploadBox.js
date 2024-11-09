import React, { useRef, useState } from 'react'
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import CSVReader from 'react-csv-reader'
import appwrite from '@/utils/appwrite';


const UploadBox = ({ user, setUser }) => {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState('');
    const [file, setFile] = useState('');
    const [data, setData] = useState([]);
    const [failedUploads, setFailedUploads] = useState([]);
    const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
    const [reportDetails, setReportDetails] = useState({ noOfSkillsBageCompletion: 0, noOfArcadeGamesCompletion: 0, noOfParticipants: 0, noOfAllCompleted: 0 });
    const [reportDetailsId, setReportDetailsId] = useState(null);

    const reportIdRef = useRef(null);

    async function onCompleteParsing(result) {
        console.log('Parsing complete:')
        console.log(result)
    }

    async function onErrorParsing(error) {
        console.log('Parsing error:')
        console.log(error)
    }

    async function onSubmit2(e) {
        e.preventDefault()

        if (!date || !file) {
            toast.error('Please fill all fields')
            return
        }

        const dateObj = new Date(date);
        console.log(dateObj)
        console.log(date)
    }

    async function onFileLoaded(data, fileInfo, originalFile) {
        console.log('Data loaded:')
        console.log(data)
        console.log('File info:')
        console.log(fileInfo)
        console.log('Original file:')
        console.log(originalFile)

        setData(data)

        // further calculations
        let noOfSkillsBageCompletion = 0;
        let noOfArcadeGamesCompletion = 0;
        let noOfAllCompleted = 0;

        await data.forEach(item => {
            if (item['# of Skill Badges Completed'] === undefined) return;
            if (item['# of Arcade Games Completed'] === undefined) return;

            if (item['# of Skill Badges Completed'] == "15")
                noOfSkillsBageCompletion += 1;

            if (item['# of Arcade Games Completed'] == "1")
                noOfArcadeGamesCompletion += 1;

            if (item['All Skill Badges & Games Completed'] === "Yes")
                noOfAllCompleted += 1;
        });

        setReportDetails({
            noOfSkillsBageCompletion,
            noOfArcadeGamesCompletion,
            noOfAllCompleted,
            noOfParticipants: data.length
        })
    }

    async function onFileError(error, file, inputElem, reason) {
        console.log('Error loading file:')
        console.log(error)
        console.log('File:')
        console.log(file)
        console.log('Input element:')
        console.log(inputElem)
        console.log('Reason:')
        console.log(reason)

        toast.error('Error loading file')
    }

    async function submitReportDetails() {
        if (!user) {
            toast.error('User not found');
            return;
        }
        if (user.name.length < 3) {
            toast.error('Name of the user not found');
            return;
        }

        const entryData = {
            uploadedBy: user.$id,
            chapterName: user.name,
            noOfParticipants: reportDetails.noOfParticipants,
            noOfSkillsBageCompletion: reportDetails.noOfSkillsBageCompletion,
            noOfArcadeGamesCompletion: reportDetails.noOfArcadeGamesCompletion,
            noOfAllCompleted: reportDetails.noOfAllCompleted,
            reportDate: new Date(date).toISOString(),
            isDeleted: false,
        }


        try {
            setLoading(true);
            const result = await appwrite.database.createDocument(
                appwrite.DATABASE_ID,
                appwrite.REPORT_DETAILS_COLLECTION_ID,
                appwrite.ID.unique(),
                entryData,
                [
                    appwrite.Permission.read(appwrite.Role.user(user.$id)), // only user can read
                    appwrite.Permission.delete(appwrite.Role.user(user.$id)), // only user can delete
                    appwrite.Permission.update(appwrite.Role.user(user.$id)), // only user can update
                ]
            );

            console.log('Database Result:')
            console.log(result)

            toast.success('Daily Report Record Created. Starting Uploading data');
            setReportDetailsId((prevValue) => result.$id);
            reportIdRef.current = result.$id;
            setLoading(false);



            return true;
        } catch (e) {
            console.log(e)
            toast.error('Error submitting report details');
        } finally {
            setLoading(false);
        }
        return false;
    }


    async function submitData(e) {
        e.preventDefault()
        setCurrentUploadIndex(0);

        if (!date || data.length === 0) {
            toast.error('Choose date of report')
            return
        }

        console.log('Report date:')
        console.log(date)

        const reportDetailsStatus = await submitReportDetails();
        if (!reportDetailsStatus) {
            toast.error('Error ceating report details record. Try again');
            return;
        }

        console.log('Report Details ID:');
        // console.log(reportDetailsId);
        console.log(reportIdRef.current);
        // return;

        for (let i = 0; i < data.length; i++) {
            const index = 23;
            const item = data[i];

            const queryData = {
                name: item['User Name'],
                email: String(item['User Email']).toLowerCase(),
                profileUrl: item['Google Cloud Skills Boost Profile URL'],
                profileUrlStatus: item['Profile URL Status'],
                codeRedemptionStatus: item['Access Code Redemption Status'],
                allCompleted: item['All Skill Badges & Games Completed'],
                noOfSkillBadgesCompleted: String(item['# of Skill Badges Completed']),
                completedSkillBadges: parseSkillBadgesNames(item['Names of Completed Skill Badges']),
                noOfArcadeGamesCompleted: String(item['# of Arcade Games Completed']),
                arcadeGamesCompleted: parseArcadeGamesNames(item['Names of Completed Arcade Games']),
                uploadedBy: user.$id,
                reportDate: new Date(date).toISOString(),
                reportId: reportIdRef.current,
            }

            console.log('Query data:')
            console.log(queryData)

            setLoading(true);
            // break;
            // return ;
            try {
                const result = await appwrite.database.createDocument(
                    appwrite.DATABASE_ID,
                    appwrite.REPORT_COLLECTION_ID,
                    appwrite.ID.unique(),
                    queryData,
                    [
                        appwrite.Permission.update(appwrite.Role.user(user.$id)), // only user can update
                        appwrite.Permission.delete(appwrite.Role.user(user.$id)), // only user can delete
                    ]
                );

                // console.log('Database Result:')
                // console.log(result)
                // toast.success('Data submitted successfully');

                setCurrentUploadIndex(i + 1);
                console.log(`uploaded ${i + 1} of ${data.length}`)

                await sleep(500);
                // console.log('Sleeping for 3 seconds')

            } catch (e) {
                console.log(e)
                toast.error('Error submitting data');
                setFailedUploads([...failedUploads, item]);
            }
            // break;
        } // loop end


        console.log('Loop End')
        toast.success("All data uploaded");
        setDate('');
        setFile('');
        setLoading(false);
    }

    function parseSkillBadgesNames(string) {
        if (!string) return [];
        const skillBadges = string.split('|').map(item => String(item).replace(" [Skill Badge]", "").trim())
        return skillBadges;
    }

    function parseArcadeGamesNames(string) {
        if (!string) return [];
        const arcadeGames = string.split('|').map(item => String(item).replace(" [Game]", "").trim())
        return arcadeGames;
    }

    // create a custom sleep function
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    const papaparseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
    }


    return (<div className='my-3'>
        <h5>Upload the progress report</h5>
        <div >
            {/* Date input */}
            <div className="mb-3">
                <label htmlFor="date" className="form-label">Report Date</label>
                <input value={date} onChange={e => setDate(e.target.value)} type="date" className="form-control" id="date" disabled={loading} />
            </div>

            {/* File Input */}
            <div className="mb-3">
                <label htmlFor="file" className="form-label">Report File (.csv)</label>
                {/* <input value={file} onChange={e => setFile(e.target.value)}
                    type="file" accept=".csv" className="form-control" id="file" /> */}

                <CSVReader
                    cssclassName="form-control"
                    onFileLoaded={onFileLoaded}
                    onError={onFileError}
                    parserOptions={papaparseOptions}
                    disabled={loading}
                />
            </div>

            {
                data.length > 0 &&
                <p>File Parsed. {data.length} number of entries found excluding header</p>
            }

            {
                (reportDetails.noOfParticipants > 0) &&
                <div>
                    <h5>Report Overview</h5>
                    <ul>
                        <li>Total Participants: {reportDetails.noOfParticipants}</li>
                        <li>Skills Badge Completion: {reportDetails.noOfSkillsBageCompletion}</li>
                        <li>Arcade Games Completion: {reportDetails.noOfArcadeGamesCompletion}</li>
                        <li>All Completed: {reportDetails.noOfAllCompleted}</li>
                    </ul>
                </div>
            }

            <button type="button" onClick={submitData} className="btn btn-primary" disabled={loading}>Upload Report</button>

            {
                (data.length > 0) &&
                <span className='ms-3'>Uploaded {currentUploadIndex}/{data.length}</span>
            }

            <p className="fw-bold mt-1 text-danger">Don't close the page or do anything when the report is uploading, else it can cause data loss.</p>
        </div>

        {
            failedUploads.length > 0 &&
            <div className='mt-3'>
                <h4>Failed Uploads</h4>
                <ul>
                    {
                        failedUploads.map((item, index) => (
                            <li key={index}>{item['User Name']} - {item['User Email']}</li>
                        ))
                    }
                </ul>
            </div>
        }





    </div>)
}

export default UploadBox