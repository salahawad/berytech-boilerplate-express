var express = require('express');
var ctrl = require('../controllers/ItemController')
var router = express.Router();
var formidable = require('formidable');

//connecting to the database
var mongoDB = process.env.dburl;
var mongoose = require('mongoose');
mongoose.connect(mongoDB, {
  useNewUrlParser: true
})

/*router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Berytech'
  });
});*/

router.get('/', function (req, res){
  res.sendFile(__dirname + './../index.html');
  console.log(__dirname);
});

router.post('/', function (req, res){
  var form = new formidable.IncomingForm();

  form.parse(req);

  form.on('fileBegin', function (name, file){
      file.path = __dirname + './../uploads/' + file.name;
  });

  form.on('file', function (name, file){
      console.log('Uploaded ' + file.name);
  });

  res.sendFile(__dirname + './../index.html');
});


module.exports = router;