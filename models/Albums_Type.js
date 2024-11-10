const mongoose = require('mongoose');

// สร้าง Schema ของ Albums_Type
const Albums_TypeSchema = new mongoose.Schema({
    type: String,
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Albums_Type', Albums_TypeSchema);
