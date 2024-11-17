import { Account, Client, Databases, Query, Role, Permission, ID, Storage } from "appwrite";

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('study-jams-progress-tracker');

const account = new Account(client);

const database = new Databases(client);
const storage = new Storage(client);

const appwrite = {
    client, database, account, storage,
    ID, Query, Role, Permission,
    PROJECT_ID: 'study-jams-progress-tracker',
    DATABASE_ID: 'study-jams-progress',
    REPORT_COLLECTION_ID: '672906e4003028ae2510',
    REPORT_DETAILS_COLLECTION_ID: 'report-details',
    CERTIFICATES_COLLECTION_ID: 'certificates',
    CERTIFICATE_BUCKET_ID: '67306cd5001e5b329d9a',
};


export default appwrite;

