require('dotenv').config({path: __dirname + '/database.env'});
const express = require('express');
const { createHash } = require('crypto');
const mysql = require('mysql');
const path = require('path');

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const db = process.env.DB_NAME;

const con = mysql.createConnection({
    host: host,
    user: user,
    password: pass,
    database: db
});

const app = express();

app.use(express.static(path.join(__dirname, '/')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/creare-cont', function(req, res) {
    const nume = req.body.nume;
    const user = req.body.email;
    const pass = req.body.password;
    const confirmPass = req.body.confirmpass;
    if(pass != confirmPass) {
        res.redirect('/creare-cont?nomatch');
        return;
    }
    const hash = createHash('sha256').update(pass).digest('base64');
    con.query(`CALL register('${nume}', '${user}', '${hash}')`, function(err, result) {
        if(err) {
            console.log(err);
            throw err;
        }
        res.redirect(`/creare-cont?${result[0][0]['stat']}`);
    });
});

app.listen(8080);