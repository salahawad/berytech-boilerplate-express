var express = require('express');
var ctrl = require('../controllers/ItemController')
var UsrGroupctrl = require('../controllers/usrgroupController')
var UsrGroupListctrl = require('../controllers/usergroupList')
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
 // res.sendFile(__dirname + './../index.html');
 res.render('../views/index.ejs');
});

router.post('/', function (req, res){
  var form = new formidable.IncomingForm();

  form.parse(req);

  form.on('fileBegin', function (name, file){

      file.path = __dirname + './../uploads/' + "Data.xlsx";
      //UGctrl.CreateUG(); it seems like the file not uploaded yet
  });
  UsrGroupListctrl.fetchUsrGroupList();
  
  form.on('file', function (name, file){
      console.log('Uploaded ' + file.name);
      UsrGroupctrl.CreateUG();
  });

  res.render('../views/index.ejs',{message:"successful uploaded"});
});

module.exports = router;