const dotenv = require('dotenv');
const express = require('express');
const { createHash } = require('crypto');
const { initializeFirebaseApp, insertObject, getDataWithPagination } = require('./firebase');
const path = require('path');
const meili = require('meilisearch');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");

dotenv.config();

const signKey = process.env.JSON_SIGN_KEY;
const http_port = process.env.HTTP_PORT;

const client = new meili.MeiliSearch({
    host: process.env.MEILI_API_HOST,
    apiKey: process.env.MEILI_API_KEY
});

initializeFirebaseApp();

const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'));

app.get('/', async function(req, res) {
    const categories = await getDataWithPagination("categories", {}, 0, 200, "id_category");
    res.render('main', {categories: categories});
});

app.post('/creare-cont', async function(req, res) {
    const nume = req.body.nume;
    const email = req.body.email;
    const pass = req.body.password;
    const confirmPass = req.body.confirmpass;
    if(pass != confirmPass) {
        res.redirect('/creare-cont?nomatch');
        return;
    }
    const hash = createHash('sha256').update(pass).digest('base64');
    const data = await getDataWithPagination("users", {key: "email", operator: "==", value: email}, 1, 1, "id_user");
    if(JSON.stringify(data) == '[]') {
        await insertObject("users", {name: nume, email: email, pass: hash});
        res.redirect('/creare-cont?success');
    }
    else res.redirect('/creare-cont?failed');
});

app.get('/conectare', function(req, res) {
    res.render('connect');
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

app.post('/fetch-data', async function(req, res) {
    const {offset} = req.body;
    const results = await getDataWithPagination("products", {}, offset, 20, "id_product");
    res.json({message: results});
});

app.get('/product/:id', async function(req, res) {
    const productID = req.params.id;
    const product = (await getDataWithPagination("products", {key: "id_product", operator: "==", value: Number(productID)}, 0, 1, "id_product"))[0];
    const categories = await getDataWithPagination("categories", {}, 0, 200, "id_category");
    const similarProducts = await getDataWithPagination("products", {key: "id_category", operator: "==", value: product.id_category}, 0, 12, "id_product");
    const images = product.image.split(';');
    images.forEach((element, index) => {
        images[index] = `/assets/images/${element}`;
    });
    product.image = JSON.stringify(images);
    res.render('product', {categories: categories, product: product, similarProducts: similarProducts});
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
                    // console.log(err);
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

app.get('/cautare', async function(req, res) {
    const query = req.query.search;
    if(query) {
        const categories = await getDataWithPagination("categories", {}, 0, 200, "id_category");
        client.index('products').search(query).then((data) => res.render('search', {
            products: data['hits'],
            categories: categories
        }));
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
            // console.log(err);
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
        else con.query(`INSERT INTO cart (id_product, id_user) SELECT ${query['product_id']}, ${decoded['id_user']} WHERE NOT EXISTS (SELECT 1 FROM cart WHERE id_product = ${query['product_id']} AND id_user = ${decoded['id_user']})`);
    });
});

app.post('/check-coupon', function(req, res) {
    const request = req.body;
    con.query(`SELECT rate FROM coupons WHERE value='${request['coupon']}'`, function(err, result) {
        if(err) {
            // console.log(err);
            throw err;
        }
        res.json({result: result[0]});
    });
});

app.post('/updateAmount', function(req, res) {
    const {id, change} = req.body;
    con.query(`UPDATE cart SET amount=amount+${change} where id=${id}`);
    res.end();
});

app.post('/deleteItemCart', function(req, res) {
    const {id} = req.body;
    con.query(`DELETE FROM cart WHERE id=${id}`);
    res.end();
});

app.post('/checkout', function(req, res) {
    const token = req.cookies.token;
    if(token == null) {
        res.redirect('/conectare');
        return;
    }
    jwt.verify(token, signKey, (err, decoded) => {
        if(err) res.redirect('/conectare');
        const {coupon} = req.body;
        con.query(`select round(sum(currentPrice),2) as total from cart join products on products.id_product = cart.id_product where id_user=${decoded['id_user']}; select rate from coupons where value='${coupon}'`, function(err, result) {
            if(err) {
                // console.log(err);
                throw err;
            }
            const subtotal = result[0][0]['total'];
            const rate = result[1].length != 0 ? result[1][0]['rate'] : 0;
            res.render('finish_order', {
                subtotal: subtotal,
                total: subtotal - subtotal * rate / 100,
                rate: rate
            });
        });
    });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('*', async function(req, res) {
    const location = req.path.split('/').filter(Boolean)[0];
    const categories = await getDataWithPagination("categories", {}, 0, 20, "id_category");
    const product_category = (await getDataWithPagination("categories", {key: "route", operator: "==", value: location}, 0, 1, "id_category"))[0];
    const products = await getDataWithPagination("products", {key: "id_category", operator: "==", value: product_category.id_category}, 0, 10, "id_product");
    res.render('category', {products: products, categories: categories});
});

app.listen(http_port);