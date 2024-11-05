import React, { useState } from 'react'
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import CSVReader from 'react-csv-reader'
import appwrite from '@/utils/appwrite';


const UploadPageBody = () => {
    const [date, setDate] = useState('')
    const [file, setFile] = useState('')
    const [data, setData] = useState([])
    const [failedUploads, setFailedUploads] = useState([]);
    const [currentUploadIndex, setCurrentUploadIndex] = useState(0);


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

    async function submitData(e) {
        e.preventDefault()
        setCurrentUploadIndex(0);

        if (!date || data.length === 0) {
            toast.error('Choose date of report')
            return
        }

        console.log('Report date:')
        console.log(date)

        for (let i = 0; i < data.length; i++) {
            const index = 23;
            const item = data[i];

            const queryData = {
                name: item['User Name'],
                email: item['User Email'],
                profileUrl: item['Google Cloud Skills Boost Profile URL'],
                profileUrlStatus: item['Profile URL Status'],
                codeRedemptionStatus: item['Access Code Redemption Status'],
                allCompleted: item['All Skill Badges & Games Completed'],
                noOfSkillBadgesCompleted: String(item['# of Skill Badges Completed']),
                completedSkillBadges: parseSkillBadgesNames(item['Names of Completed Skill Badges']),
                noOfArcadeGamesCompleted: String(item['# of Arcade Games Completed']),
                arcadeGamesCompleted: parseArcadeGamesNames(item['Names of Completed Arcade Games']),
                uploadedBy: "admin",
                reportDate: new Date(date).toISOString()
            }

            console.log('Query data:')
            console.log(queryData)

            // break;
            try {
                const result = await appwrite.database.createDocument(
                    appwrite.DATABASE_ID,
                    appwrite.REPORT_COLLECTION_ID,
                    appwrite.ID.unique(),
                    queryData,
                );

                // console.log('Database Result:')
                // console.log(result)

                // toast.success('Data submitted successfully');
                setCurrentUploadIndex(i + 1);
                console.log(`uploaded ${i + 1} of ${data.length}`)

                // await sleep(3000);
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




    return (<main className='container my-3'>

        <h1>Upload Page</h1>
        <div >
            {/* Date input */}
            <div className="mb-3">
                <label htmlFor="date" className="form-label">Report Date</label>
                <input value={date} onChange={e => setDate(e.target.value)} type="date" className="form-control" id="date" />
            </div>

            {/* File Input */}
            <div className="mb-3">
                <label htmlFor="file" className="form-label">Report File (.csv)</label>
                {/* <input value={file} onChange={e => setFile(e.target.value)}
                    type="file" accept=".csv" className="form-control" id="file" /> */}

                <CSVReader
                    cssClass="form-control"
                    onFileLoaded={onFileLoaded}
                    onError={onFileError}
                    parserOptions={papaparseOptions}
                />
            </div>

            {
                data.length > 0 &&
                <p>File Parsed. {data.length} number of entries found excluding header</p>
            }

            <button type="button" onClick={submitData} className="btn btn-primary">Submit</button>

            {
                data.length > 0 &&
                <p>Data Uploaded: {currentUploadIndex}/{data.length}</p>
            }

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





    </main>)
}

export default UploadPageBody