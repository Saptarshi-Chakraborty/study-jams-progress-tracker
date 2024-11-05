import { Account, Client, Databases, Query, Role, Permission, ID } from "appwrite";

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('study-jams-progress-tracker');

const account = new Account(client);

const database = new Databases(client);

const appwrite = {
    client, database, account,
    ID, Query, Role, Permission,
    PROJECT_ID: 'study-jams-progress-tracker',
    DATABASE_ID: 'study-jams-progress',
    REPORT_COLLECTION_ID: '672906e4003028ae2510',
};


export default appwrite;

