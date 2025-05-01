const dotenv = require('dotenv');
const express = require('express');
const { createHash } = require('crypto');
const { initializeFirebaseApp, insertObject, updateObject, getDataWithPagination, deleteDocumentByConditions } = require('./firebase');
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
    const user = await getDataWithPagination("users", [{key: "email", operator: "==", value: email}], 0, 1, "email");
    if(JSON.stringify(user) == '[]') {
        await insertObject("users", {name: nume, email: email, pass: hash});
        res.redirect('/creare-cont?success');
    }
    else res.redirect('/creare-cont?failed');
});

app.get('/conectare', function(req, res) {
    res.render('connect');
});

app.post('/conectare', async function(req, res) {
    const email = req.body.email;
    const pass = req.body.password;
    const hash = createHash('sha256').update(pass).digest('base64');
    const user = await getDataWithPagination("users", [{key: "email", operator: "==", value: email}, {key: "pass", operator: "==", value: hash}], 0, 1, "email");
    if(user.length == 0) res.redirect(`/conectare?failed`);
    else {
        const token = jwt.sign({
            username: email
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

app.post('/fetch-data', async function(req, res) {
    const {offset} = req.body;
    const results = await getDataWithPagination("products", {}, offset, 20, "id_product");
    res.json({message: results});
});

app.get('/product/:id', async function(req, res) {
    const productID = req.params.id;
    const product = (await getDataWithPagination("products", [{key: "id_product", operator: "==", value: Number(productID)}], 0, 1, "id_product"))[0];
    const categories = await getDataWithPagination("categories", [], 0, 200, "id_category");
    const similarProducts = await getDataWithPagination("products", [{key: "id_category", operator: "==", value: product.id_category}], 0, 12, "id_product");
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
    jwt.verify(token, signKey, async (err, decoded) => {
        if(err) {
            res.redirect('/conectare');
            return;
        }
        else {
            const cartProducts = await getDataWithPagination("cart", [{key: "user_email", operator: "==", value: decoded.username}], 0, 200, "id_product");
            const categories = await getDataWithPagination("categories", [], 0, 20, "id_category");
            const products = await getDataWithPagination("products", [], 0, 20, "id_product");
            let productItems = [];
            if(cartProducts.length != 0) {
                //TODO modify getDataWithPagination function to accept null values for limit and order by params
                const productIds = [];
                cartProducts.forEach((product) => productIds.push(product.id_product));
                productItems = await getDataWithPagination("products", [{key: "id_product", operator: "in", value: productIds}], 0, productIds.length, "id_product");
                productItems.forEach((product, index) => {
                    product.amount = cartProducts[index].amount;
                    product.user_email = cartProducts[index].user_email;
                });
            }
            res.render('cart', {products: products, categories: categories, cart_products: productItems});
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

app.get('/comenzi', async function(req, res) {
    const token = req.cookies.token;
    if(token == null) {
        res.redirect('/conectare');
        return;
    }
    const categories = await getDataWithPagination("categories", [], 0, 20, "id_category");
    const products = await getDataWithPagination("products", [], 0, 20, "id_product");
    res.render('orders', {categories: categories, similarProducts: products});
    //TODO query ordered items from database and render them
});

app.post('/addtocart', function(req, res) {
    const query = req.body;
    const token = req.cookies.token;
    if(token == null) {
        res.json({status: 'failed', reason: 'noauth'});
        return;
    }
    jwt.verify(token, signKey, async (err, decoded) => {
        if(err) {
            res.redirect('/conectare');
            return;
        }
        const cartProduct = await getDataWithPagination("cart", [{key: "id_product", operator: "==", value: Number(query.product_id)}, {key: "user_email", operator: "==", value: decoded.username}], 0, 1, "id_product");
        if(cartProduct.length == 0) insertObject("cart", {id_product: Number(query.product_id), amount: 1, user_email: decoded.username});
        else res.json({status: 'failed', reason: 'already_exists'});
    });
});

app.post('/check-coupon', async function(req, res) {
    const request = req.body;
    const coupon = await getDataWithPagination("coupons", [{key: "value", operator: "==", value: request.coupon}], 0, 1, "value");
    res.json({result: coupon[0]});
});

app.post('/updateAmount', async function(req, res) {
    const {id, user, change} = req.body;
    const amount = (await getDataWithPagination("cart", [], 0, 1, "id_product"))[0].amount;
    const result = await updateObject("cart", [{ key: "id_product", operator: "==", value: id }, { key: "user_email", operator: "==", value: user }], "id_product", { amount: amount + change });
    if(result)
        res.status(204).end();
});

app.post('/deleteItemCart', async function(req, res) {
    const {id, user} = req.body;
    await deleteDocumentByConditions("cart", [{key: "id_product", operator: "==", value: id}, {key: "user_email", operator: "==", value: user}]);
    res.status(204).end();
});

app.post('/checkout', function(req, res) {
    const token = req.cookies.token;
    if(token == null) {
        res.redirect('/conectare');
        return;
    }
    jwt.verify(token, signKey, async (err, decoded) => {
        if(err) res.redirect('/conectare');
        const {coupon} = req.body;
        const rate = (await getDataWithPagination("coupons", [{key: "value", operator: "==", value: coupon}], 0, 1, "value"))[0];
        const cartProducts = await getDataWithPagination("cart", [{key: "user_email", operator: "==", value: decoded.username}], 0, 200, "id_product");
        let productItems = [];
        let subtotal = 0;
        if(cartProducts.length != 0) {
            //TODO modify getDataWithPagination function to accept null values for limit and order by params
            const productIds = [];
            cartProducts.forEach((product) => productIds.push(product.id_product));
            productItems = await getDataWithPagination("products", [{key: "id_product", operator: "in", value: productIds}], 0, productIds.length, "id_product");
            productItems.forEach((product, index) => {
                product.amount = cartProducts[index].amount;
                subtotal += product.amount * product.currentPrice;
            });
        }
        subtotal = Math.round(subtotal * 100) / 100;
        let total = subtotal;
        if(rate != undefined) total = subtotal - subtotal * rate.rate / 100;
        res.render('finish_order', {subtotal: subtotal, rate: rate == undefined ? 0 : rate.rate, total: total});
    });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('*', async function(req, res) {
    const location = req.path.split('/').filter(Boolean)[0];
    const categories = await getDataWithPagination("categories", {}, 0, 20, "id_category");
    const product_category = (await getDataWithPagination("categories", [{key: "route", operator: "==", value: location}], 0, 1, "id_category"))[0];
    const products = await getDataWithPagination("products", [{key: "id_category", operator: "==", value: product_category.id_category}], 0, 10, "id_product");
    res.render('category', {products: products, categories: categories});
});

app.listen(http_port);