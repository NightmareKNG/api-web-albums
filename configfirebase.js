require("dotenv").config();
const admin = require("firebase-admin");

const fs = require("fs");

const serviceAccount = JSON.parse(
  fs.readFileSync("serviceAccountKey.json", "utf8")
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "project-adw.appspot.com"
});

const bucket = admin.storage().bucket();
module.exports = bucket;
console.log("FIREBASE_SERVICE_ACCOUNT_KEY:", process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
