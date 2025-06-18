const dotenv = require('dotenv');
const { initializeFirebaseApp, getDataWithPagination } = require('./firebase');
const meili = require('meilisearch');

dotenv.config();

const meiliClient = new meili.MeiliSearch({
    host: process.env.MEILI_API_HOST,
    apiKey: process.env.MEILI_API_KEY
});

initializeFirebaseApp();

async function main()
{
    const products = await getDataWithPagination("products", {}, 0, 1000, "id_product");
    meiliClient.index('products').addDocuments(products);
    console.log('123');
}

main();