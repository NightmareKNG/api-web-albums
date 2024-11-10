const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Album_Type = require('../models/Albums_Type.js');

// GET ทุกอัลบั้ม พร้อมข้อมูล type ที่เชื่อมต่อ
router.get('/', (req, res, next) => {
    Album_Type.find()
        .populate('type') // ใช้ populate เพื่อดึงข้อมูลจาก Album_Types_type_Type
        .exec((err, Album_Types_type) => {
            if (err) return next(err);
            res.status(200).json(Album_Types_type);
        });
});

// GET อัลบั้มตาม id พร้อมข้อมูล type ที่เชื่อมต่อ
router.get('/:id', (req, res, next) => {
    Album_Type.findById(req.params.id)
        .populate('type') // ใช้ populate เพื่อดึงข้อมูลจาก Album_Types_type_Type
        .exec((err, Album_Type) => {
            if (err) return next(err);
            if (!Album_Type) return res.status(404).json({ message: 'Album_Type not found' });
            res.status(200).json(Album_Type);
        });
});

// POST สร้างอัลบั้มใหม่
router.post('/', (req, res, next) => {
    Album_Type.create(req.body, (err, Album_Type) => {
        if (err) return next(err);
        res.status(201).json(Album_Type);
    });
});

// PUT แก้ไขอัลบั้มตาม id
router.put('/:id', (req, res, next) => {
    Album_Type.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, Album_Type) => {
        if (err) return next(err);
        if (!Album_Type) return res.status(404).json({ message: 'Album_Type not found' });
        res.status(200).json(Album_Type);
    });
});

// DELETE ลบอัลบั้มตาม id
router.delete('/:id', (req, res, next) => {
    Album_Type.findByIdAndDelete(req.params.id, (err, Album_Type) => {
        if (err) return next(err);
        if (!Album_Type) return res.status(404).json({ message: 'Album_Type not found' });
        res.status(200).json({ message: 'Album_Type deleted successfully', Album_Type });
    });
});

module.exports = router;
