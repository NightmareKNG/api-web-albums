const admin = require("firebase-admin");

// ใช้ path จากตัวแปรสภาพแวดล้อม
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccount)),
  storageBucket: "project-adw.appspot.com"
});

const bucket = admin.storage().bucket();

module.exports = bucket;
