const dotenv = require('dotenv');
const mysql = require('mysql');
const { initializeFirebaseApp, updateObject, getDataWithPagination } = require('./firebase');

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
    const data = await updateObject("cart", [{key: "id_product", operator: "==", value: 4}, {key: "user_email", operator: "==", value: "lbodlev888@gmail.com"}], "id_product");
    console.log(data);
    process.exit(0);
}

main();