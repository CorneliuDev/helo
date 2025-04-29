const dotenv = require('dotenv');
const mysql = require('mysql');
const { insertObject, initializeFirebaseApp, getDataWithPagination } = require('./firebase');

dotenv.config();
initializeFirebaseApp();

const {
    DB_HOST, DB_USER, DB_PASS, DB_NAME
} = process.env;

const con = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});

async function main()
{
    const data = await getDataWithPagination("categories", 5, 10, "id_category");
    console.log(data);
    process.exit(0);
}

main();