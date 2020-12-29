const axios = require('axios');
const excelToJson = require('convert-excel-to-json');
'use strict';
var mongoDB =process.env.dburl;
var UserGroup = require('../models/usrgroup');
const slackToken =process.env.token;
const url = 'https://slack.com/api/usergroups.create';
let mongoose = require("mongoose");

/*
var ax = require('axios').create({
    baseURL: process.env.typeformurl,
    headers: {
        authorization: 'Bearer ' + process.env.tfauthcode
    }
});
*/

//connecting to the database
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


//read excel file team-name column & add to object []
const result = excelToJson({
    sourceFile: './routes/uploads/Data.xlsx',
    header:{
        rows: 1
    },
    columnToKey: {
        A: 'firstName',
        B: 'lastName',
        C: 'email',
        D: 'teamName',
        E: 'action'
    }
});
console.log(result);

// call usergroup.create slack method

run().catch(err => console.log(err));

//should check first if usergroup.name exist in db 
async function run(usrgroup) {
    //move all static variable outside the function
    usrgroup = result.sheet1;
  
    for (var i = 0; i < usrgroup.length; i++) {
        const res = await axios.post(url, {
        channel: 'general',
        name: usrgroup[i].teamName
        }, { headers: { authorization: `Bearer ${slackToken}` } });

    console.log('Done', res.data);
    // show the output before save it in db
    // save output in obj variable 
    if(!res.data) return; 
    var obj = res.data;
    //create new logger and log it as
    
    //if usergroup is created already
    var groups = new UserGroup({ name: obj.usergroup.name, id: obj.usergroup.id, status: "active" });
    groups.save(function (err) {
    if (err) return handleError(err);
      console.log("this document is saved");
    });
  
    }
}



