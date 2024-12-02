require("dotenv").config();
const admin = require("firebase-admin");


const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "project-adw.appspot.com"
});

const bucket = admin.storage().bucket();
module.exports = bucket;
console.log("FIREBASE_SERVICE_ACCOUNT_KEY:", process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
