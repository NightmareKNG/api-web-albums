const mongoose = require('mongoose');
const Albums_Type = require('./Albums_Type'); // อิมพอร์ต Albums_Type เพื่อใช้งานเป็น reference

// สร้าง Schema ของ Albums ที่เชื่อมต่อกับ Albums_Type
const AlbumsSchema = new mongoose.Schema({
    name: String,
    image: String,
    detail: String,
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Albums_Type' }, // เชื่อม type กับ Albums_Type ด้วย ObjectId
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Albums', AlbumsSchema);
