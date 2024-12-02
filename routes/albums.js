const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Album = require('../models/Albums.js');
const bucket = require('../configfirebase.js');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // ใช้ memory storage สำหรับ multer
// GET ทุกอัลบั้ม พร้อมข้อมูล type ที่เชื่อมต่อ
router.get('/', (req, res, next) => {
    Album.find()
        .populate('type') // ใช้ populate เพื่อดึงข้อมูลจาก Albums_Type
        .exec((err, albums) => {
            if (err) return next(err);
            res.status(200).json(albums);
        });
});

// GET อัลบั้มตาม id พร้อมข้อมูล type ที่เชื่อมต่อ
router.get('/:id', (req, res, next) => {
    Album.findById(req.params.id)
        .populate('type') // ใช้ populate เพื่อดึงข้อมูลจาก Albums_Type
        .exec((err, album) => {
            if (err) return next(err);
            if (!album) return res.status(404).json({ message: 'Album not found' });
            res.status(200).json(album);
        });
});
// POST สร้างอัลบั้มใหม่
const { v4: uuidv4 } = require('uuid');

router.post('/image', upload.single('image'), (req, res, next) => {
  if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileName = `Exhauct/${uuidv4()}_${req.file.originalname}`;
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
      metadata: {
          contentType: req.file.mimetype,
      },
  });

  blobStream.on('error', (err) => {
      console.error('Error uploading file:', err);
      return next(err);
  });

  blobStream.on('finish', async () => {
      try {
          // ใช้ getSignedUrl เพื่อสร้าง URL ที่ต้องการ
          const [url] = await blob.getSignedUrl({
              action: 'read',
              expires: '03-09-2491', // ระบุเวลาหมดอายุของ URL
          });

          res.status(201).json({
              message: 'File uploaded successfully',
              imageUrl: url,
          });
      } catch (err) {
          console.error('Error generating signed URL:', err);
          return next(err);
      }
  });

  blobStream.end(req.file.buffer);
});


// บันทึกข้อมูลอัลบั้มโดยใช้ URL ของภาพจาก Firebase
router.post('/', (req, res, next) => {
    const { name, image, detail, type } = req.body;

    // ตรวจสอบว่ามีข้อมูลครบถ้วน
    if (!name || !image || !detail || !type) {
        return res.status(400).json({ message: 'All fields are required: name, image, detail, type' });
    }

    Album.create(req.body, (err, album) => {
        if (err) return next(err);
        res.status(201).json(album);
    });
});


// PUT แก้ไขอัลบั้มตาม id
router.put('/:id', (req, res, next) => {
    Album.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, album) => {
        if (err) return next(err);
        if (!album) return res.status(404).json({ message: 'Album not found' });
        res.status(200).json(album);
    });
});

// DELETE ลบอัลบั้มตาม id
router.delete('/:id', (req, res, next) => {
    Album.findByIdAndDelete(req.params.id, (err, album) => {
        if (err) return next(err);
        if (!album) return res.status(404).json({ message: 'Album not found' });
        res.status(200).json({ message: 'Album deleted successfully', album });
    });
});

module.exports = router;
