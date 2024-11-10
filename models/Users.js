const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    email: String,
    password: String,
    username: String,
    profile: String,
    updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Users', UsersSchema)