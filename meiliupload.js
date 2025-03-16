const meili = require('meilisearch');
const products = require('./dataset.json');

const client = new meili.MeiliSearch({
    host: "http://localhost:7700",
    apiKey: "yHx0xwwnFxoGEDs5jMAt"
});
client.index('products').addDocuments(products).then((res) => console.log(res));


// client.index('products').updateSettings({
//     searchableAttributes: ["title"]
// }).then(() => {
//     client.index('products').search('13').then((res) => console.log(res));
// });