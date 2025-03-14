const meili = require('meilisearch');
const products = require('./dataset.json');

const client = new meili.MeiliSearch({
    host: "http://localhost:7700",
    apiKey: "secret"
});
// client.index('products').addDocuments(products).then((res) => console.log(res));
client.index('products').search('Xiaomi Redmi Note 13').then((res) => console.log(res));