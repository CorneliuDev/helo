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

app.post('/conectare', function(req, res) {
    const email = req.body.email;
    const pass = req.body.password;
    const hash = createHash('sha256').update(pass).digest('base64');

    con.query(`SELECT id_user FROM users WHERE email='${email}' and password='${hash}'`, function(err, result) {
        if(err) throw err;
        if(Object.keys(result).length === 0) res.redirect(`/conectare?failed`);
        else res.redirect(`/index.html?connected`);
    });
});

app.post('/fetch-data', function(req, res) {
    const {offset} = req.body;
    con.query(`SELECT * FROM products LIMIT 12 OFFSET ${offset}`, function(err, result) {
        if(err) {
            console.log(err);
            res.json({ message: "error"});
        }
        res.json({ message: result});
    });
});

app.listen(8080);