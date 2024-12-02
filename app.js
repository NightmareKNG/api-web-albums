var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const albums = require('./routes/albums');
const albums_type = require('./routes/albums_type');
require('dotenv').config()
const url = process.env.MONGO_URI
const cors = require('cors');

mongoose.Promise = global.Promise;

mongoose.connect(url)
        .then(() => console.log('connection successfully!'))
        .catch((err) => console.error(err))

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// ตั้งค่า CORS ให้รองรับจากโดเมนที่ต้องการ
app.options('*', cors());  // รับทุก OPTIONS request

app.use(cors({
  origin: [
    'http://localhost:5173', // สำหรับการพัฒนาในเครื่อง
    'https://candid-valkyrie-97ac11.netlify.app', // สำหรับ production หรือ Netlify
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // กำหนด method ที่รองรับ
  allowedHeaders: ['Content-Type', 'Authorization'],  // กำหนด header ที่อนุญาต
  credentials: true,  // ถ้าต้องการให้รับ cookie ด้วย
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/albums', albums);
app.use('/albums_type', albums_type);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});
app.use((err, req, res, next) => {
  console.error(err.stack);  // แสดงรายละเอียดของข้อผิดพลาด
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
