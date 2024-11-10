const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // อิมพอร์ต bcrypt สำหรับแฮชรหัสผ่าน
const User = require('../models/Users.js');

// POST ล็อกอินผู้ใช้
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  // ตรวจสอบว่ามี email และ password
  if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
      // ค้นหาผู้ใช้ในฐานข้อมูลตาม email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // ตรวจสอบรหัสผ่าน
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Incorrect password' });
      }

      // หากรหัสผ่านถูกต้อง ให้ตอบกลับด้วยข้อมูลผู้ใช้หรือ token สำหรับเซสชัน
      res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
      next(err);
  }
});

// GET ดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/', (req, res, next) => {
    User.find((err, users) => {
        if (err) return next(err);
        res.status(200).json(users);
    });
});

// GET ดึงข้อมูลผู้ใช้ตาม ID
router.get('/:id', (req, res, next) => {
    User.findById(req.params.id, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    });
});

// POST เพิ่มข้อมูลผู้ใช้ใหม่ พร้อมแฮชรหัสผ่าน
router.post('/', async (req, res, next) => {
    const { email, password, username, profile } = req.body;

    if (!email || !password || !username || !profile) {
        return res.status(400).json({ message: 'All fields are required: email, password, username, profile' });
    }

    try {
        // แฮชรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // สร้างผู้ใช้ใหม่พร้อมรหัสผ่านที่แฮชแล้ว
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            profile
        });

        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
});

// PUT อัปเดตข้อมูลผู้ใช้ตาม ID พร้อมแฮชรหัสผ่านใหม่ถ้ามีการเปลี่ยนแปลง
router.put('/:id', async (req, res, next) => {
    const { password, ...updateData } = req.body;

    try {
        if (password) {
            // แฮชรหัสผ่านใหม่
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
});

// PUT เปลี่ยนรหัสผ่าน
router.put('/change-password/:id', async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  // ตรวจสอบว่ามี oldPassword และ newPassword
  if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both old and new passwords are required' });
  }

  try {
      // ค้นหาผู้ใช้ในฐานข้อมูลตาม ID
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // ตรวจสอบว่ารหัสผ่านเก่าถูกต้องหรือไม่
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Old password is incorrect' });
      }

      // แฮชรหัสผ่านใหม่
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // อัปเดตรหัสผ่านใหม่ลงในฐานข้อมูล
      user.password = hashedNewPassword;
      await user.save();

      res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
      next(err);
  }
});

// DELETE ลบข้อมูลผู้ใช้ตาม ID
router.delete('/:id', (req, res, next) => {
    User.findByIdAndDelete(req.params.id, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully', user });
    });
});

module.exports = router;
