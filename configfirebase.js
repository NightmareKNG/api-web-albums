const admin = require("firebase-admin");
const serviceAccount = require("./path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)   ,
  storageBucket: "project-adw.appspot.com"
});

const bucket = admin.storage().bucket();

module.exports = bucket;
