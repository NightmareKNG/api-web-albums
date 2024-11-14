const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "project-adw.appspot.com"
});

// สร้าง bucket instance จาก admin.storage()
const bucket = admin.storage().bucket();

module.exports = bucket; // ส่งออก bucket เพื่อใช้งานในไฟล์อื่น
