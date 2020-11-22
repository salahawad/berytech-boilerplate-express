var express = require('express');
var ctrl = require('../controllers/ItemController')
var router = express.Router();

//connecting to the database
var mongoDB = process.env.dburl;
var mongoose = require('mongoose');
mongoose.connect(mongoDB, {
  useNewUrlParser: true
})

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Berytech'
  });
});

module.exports = router;