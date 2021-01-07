var express = require('express');
var ctrl = require('../controllers/ItemController')
var UGctrl = require('../controllers/usrgroupController')
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
    //what is we have different file name entered?
      //file.path = __dirname + './../uploads/' + file.name;
      file.path = __dirname + './../uploads/' + "Data.xlsx";
      //UGctrl.CreateUG(); it seems like the file not uploaded yet
  });

  form.on('file', function (name, file){
      console.log('Uploaded ' + file.name);
      UGctrl.CreateUG();
  });

  res.sendFile(__dirname + './../index.html');
  //UGctrl.CreateUG();
});
//UGctrl.CreateUG(); error if excel file not exist

module.exports = router;