var express = require('express');
//var ctrl = require('../controllers/ItemController')
var UsrGroupctrl = require('../controllers/usrgroupController')
var UsrGroupListctrl = require('../controllers/usergroupList')
var ctrl = require('../controllers/function')
var router = express.Router();
var formidable = require('formidable');

//connecting to the database
var mongoDB = process.env.dburl;
var mongoose = require('mongoose');
mongoose.connect(mongoDB, {
  useNewUrlParser: true
})

//try to show table result in new webpag
router.get('/table', function (req, res) {
  res.render('sampletable.ejs');
});
// I include sampletable in index file but this table should be appear before upload not after!!
router.get('/', function (req, res) {
  res.render('index.ejs', {
    message: ""
  });
});

router.post('/', function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req);

  form.on('fileBegin', function (name, file) {
    file.path = '/uploads/Data.xlsx';
  });
  //fetch usergroup list to update local db before call createUG() function
  UsrGroupListctrl.fetchUsrGroupList();

  form.on('file', function (name, file) {
    console.log('Uploaded ' + file.name);
    //UsrGroupctrl.CreateUG();
  });

  res.render('index.ejs', {
    message: "successful uploaded"
  });
});
//trying to show returned message after calling CreateUG() but it seems that message doesn't show
router.get('/result', function (req, res) {
  var r = UsrGroupctrl.CreateUG();
  res.send(r);
});
// try to test a sum function if I can display the returned value on webpage 
// thye test is successful and result appears
router.get('/test', function (req, res) {
  var s = ctrl.sum(3, 9);
  res.send(s);
});

module.exports = router;