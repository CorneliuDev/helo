const { initializeFirebaseApp, insertObject } = require('./firebase');

initializeFirebaseApp();
async function main()
{
    await insertObject("users", {test: 123, tralala: "password"});
    process.exit(0);
}

main();