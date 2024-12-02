const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    profile: { type: String, default: null }, // กำหนดค่า default เป็น null
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Users', UsersSchema);
