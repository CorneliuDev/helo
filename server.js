require('dotenv').config({path: __dirname + '/database.env'});
const express = require('express');
const { createHash } = require('crypto');
const mysql = require('mysql');
const path = require('path');
const meili = require('meilisearch');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const signKey = 'pSLH30RAM4fUKKkKyYzL';

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const db = process.env.DB_NAME;

const con = mysql.createConnection({
    host: host,
    user: user,
    password: pass,
    database: db,
    multipleStatements: true
});

const client = new meili.MeiliSearch({
    host: "http://localhost:7700",
    apiKey: "yHx0xwwnFxoGEDs5jMAt"
});

const app = express();

app.use(express.static(path.join(__dirname, '/')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
    con.query('SELECT * FROM categories', function(err, result) {
        if(err) {
            console.log(err);
            throw err;
        }
        res.render('main', {categories: result});
    });
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
        else {
            const token = jwt.sign({
                id_user: result[0]['id_user'],
                username: email,
            }, signKey, {expiresIn: "1h"});
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "strict"
            });
            res.cookie("auth", true, {
                sameSite: "strict"
            });
            res.redirect('/');
        }
    });
});

app.post('/fetch-data', function(req, res) {
    const {offset} = req.body;
    con.query(`SELECT * FROM products LIMIT 20 OFFSET ${offset}`, function(err, result) {
        if(err) {
            console.log(err);
            res.json({ message: "error"});
        }
        res.json({ message: result});
    });
});

app.get('/product/:id', async function(req, res) {
    const productID = req.params.id;
    con.query(`SELECT * FROM products WHERE id_product=${productID}; select * from products where id_category=(SELECT id_category FROM products where id_product=${productID}) and id_product != ${productID} limit 12; SELECT * FROM categories`, (err, results) => {
        if(err) {
            console.log(err);
            throw err;
        }
        const product = results[0][0];
        const similar = results[1];
        images = product['image'].split(';');
        images.forEach((element, index) => {
            images[index] = `/media/images/${element}`;
        });
        res.render('product', {
            title: product['title'],
            currentPrice: product['currentPrice'],
            oldPrice: product['oldPrice'],
            rating: product['rating'],
            description: product['description'],
            images: images,
            similarProducts: similar,
            categories: results[2]
        });
    });
});

app.get('/cart', function(req, res) {
    const token = req.cookies.token;
    if(token == null) {
        res.redirect('/conectare');
        return;
    }
    jwt.verify(token, signKey, (err, decoded) => {
        if(err) {
            res.redirect('/conectare');
            return;
        }
        else {
            con.query(`SELECT * FROM products ORDER BY rand() limit 20; select * from categories; select id, image, title, currentPrice, oldPrice, rating, description, amount from cart join products on products.id_product = cart.id_product where id_user=${decoded['id_user']}`, function(err, result) {
                if(err) {
                    console.log(err);
                    throw err;
                }
                res.render('cart', {
                    products: result[0],
                    categories: result[1],
                    cart_products: result[2]
                });
            });
        }
    });
});

app.get('/cautare', function(req, res) {
    const query = req.query.search;
    if(query) {
        con.query('SELECT * FROM categories', function(err, result) {
            if(err) {
                console.log(err);
                throw err;
            }
            client.index('products').search(query).then((data) => res.render('search', {
                products: data['hits'],
                categories: result
            }));
        });
    }
});

app.get('/comenzi', function(req, res) {
    const token = req.cookies.token;
    if(token == null) {
        res.redirect('/conectare');
        return;
    }
    con.query('SELECT * FROM categories; SELECT * FROM products ORDER BY rand() limit 20', function(err, result) {
        if(err) {
            console.log(err);
            throw err;
        }
        res.render('orders', {
            categories: result[0],
            similarProducts: result[1]
        });
    });
});

app.post('/addtocart', function(req, res) {
    const query = req.body;
    const token = req.cookies.token;
    if(token == null) {
        res.json({status: 'failed', reason: 'noauth'});
        return;
    }
    jwt.verify(token, signKey, (err, decoded) => {
        if(err) {
            res.redirect('/conectare');
            return;
        }
        else con.query(`INSERT INTO cart (id_product, id_user) VALUES (${query['product_id']}, ${decoded['id_user']})`);
    });
});

app.post('/check-coupon', function(req, res) {
    const request = req.body;
    con.query(`SELECT rate FROM coupons WHERE value='${request['coupon']}'`, function(err, result) {
        if(err) {
            console.log(err);
            throw err;
        }
        res.json({result: result[0]});
    });
});

app.post('/updateAmount', function(req, res) {
    const {id, change} = req.body;
    console.log(`${id} ${change}`);
    con.query(`UPDATE cart SET amount=amount+${change} where id=${id}`);
    res.end();
});

app.post('/deleteItemCart', function(req, res) {
    const {id} = req.body;
    con.query(`DELETE FROM cart WHERE id=${id}`);
    res.end();
});

app.get('*', function(req, res) {
    const location = req.path.toLowerCase().substring(1);
    con.query(`select * from products where id_category=(SELECT id_category from categories where route='${location}'); select * from categories`, function(err, result) {
        if(err) {
            console.log(err);
            throw err;
        }
        res.render('category', {
            products: result[0],
            categories: result[1]
        });
    });
});

app.listen(8080);