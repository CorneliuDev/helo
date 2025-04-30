const { initializeApp } = require("firebase/app");
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();
const { getFirestore, doc, setDoc, collection, getDocs, query,
	where, deleteDoc, startAt, limit, orderBy, updateDoc } = require("firebase/firestore");

const {
	FIREBASE_API_KEY,
	FIREBASE_AUTH_DOMAIN,
	FIREBASE_PROJECT_ID,
	FIREBASE_STORAGE_BUCKET,
	FIREBASE_MESSAGE_SENDER_ID,
	FIREBASE_APP_ID
} = process.env;

const firebaseConfig = {
	apiKey: FIREBASE_API_KEY,
	authDomain: FIREBASE_AUTH_DOMAIN,
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	messagingSenderId: FIREBASE_MESSAGE_SENDER_ID,
	appId: FIREBASE_APP_ID
};

let db = null;

const initializeFirebaseApp = () => {
	try {
		const app = initializeApp(firebaseConfig);
		db = getFirestore(app);
		console.log("Firebase initialized successfully.");
	} catch (error) {
		console.error(`Firebase initialization error: ${error}`);
	}
};

/**
 * Inserts an object into a specific collection.
 * @param {string} collectionName - The name of the collection.
 * @param {object} object - The object to insert.
 */
const insertObject = async function(collectionName, object)
{
	try {
		const collectionRef = collection(db, collectionName);
		const document = doc(collectionRef, uuidv4());
		await setDoc(document, object);
	}
	catch(error)
	{ console.log(`Firebase doc push: ${error}`); }
};
/**
 * Updates just one object with a new one based on some conditions
 * @param {string} collectionName - The name of the collection.
 * @param {object} conditions - Query constraints: { key, operator, value }.
 * @param {string} field - Field to order by with
 * * @param {object} newObject - 
 * @returns {Array<object>} - Array of documents with their IDs.
 */
const updateObject = async function (collectionName, conditions, field, newObject) {
	try
	{
		const data = (await getDataWithPagination(collectionName, conditions, 0, 1, field))[0];
		const document = doc(db, collectionName, data.id);
		await updateDoc(document, newObject);
		return true;
	}	
	catch(error)
	{
		console.log(`Firebase doc update: ${error}`);
		return false;
	}
};

/**
 * Returns data from a collection within a range from start to start+20
 * @param {string} collectionName - The name of the collection.
 * @param {object} conditions - Query constraints: { key, operator, value }.
 * @param {number} start - Index from where to start pagination
 * @param {number} length - Length of the page
 * @param {string} field - Field to order by with
 * @returns {object} - Object with document IDs as keys and data as values.
 */
const getDataWithPagination = async (collectionName, conditions, start, length, field) => {
	try {
		const collectionRef = collection(db, collectionName);
		let q = query(collectionRef, orderBy(field), startAt(start+1), limit(length));
		if(Object.keys(conditions).length > 0) {
			conditions.forEach((condition) => {
				q = query(q, where(condition.key, condition.operator, condition.value));
			});
		}

		const docSnap = await getDocs(q);
		const finalData = [];
		docSnap.forEach((doc) => {
			const current = doc.data();
			current.id = doc.id;
			finalData.push(current);
		});
		return finalData;
	} catch (error) {
		console.error(`Get data by condition error: ${error}`);
		return {};
	}
};

/**
 * Deletes documents from a collection by email.
 * @param {string} collectionName - The name of the collection.
 * @param {string} condition - Array of Query constraints: { key, value }.
 */
const deleteDocumentByConditions = async function(collectionName, conditions)
{
	try
	{
		const collectionRef = collection(db, collectionName);
		let q = query(collectionRef);
		if(Object.keys(conditions).length > 0) {
			conditions.forEach((condition) => {
				q = query(q, where(condition.key, condition.operator, condition.value));
			});
		}
		const docSnap = await getDocs(q);
		for(const document of docSnap.docs)
			await deleteDoc(document.ref);
	}
	catch(error)
	{ console.log(`Doc delete: ${error}`); }
};

module.exports = {
	initializeFirebaseApp,
	insertObject,
	updateObject,
	deleteDocumentByConditions,
	getDataWithPagination
};