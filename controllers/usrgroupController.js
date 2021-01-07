const axios = require('axios');
const excelToJson = require('convert-excel-to-json');
'use strict';
var mongoDB =process.env.dburl;
var UserGroup = require('../models/usrgroup');
const slackToken =process.env.token;
const url = 'https://slack.com/api/usergroups.create';
const uri ="mongodb://localhost:27017/";
let mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const client = new MongoClient(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

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
    //Q1. once I upload excel file how I can call it with not specific name??
    //Q2. how I can run this function after uploading the file 
    sourceFile: __dirname + './../uploads/Data.xlsx',
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

//run().catch(err => console.log(err));

//should check first if usergroup.name exist in db 
exports.CreateUG = async function (usrgroup) {
    //move all static variable outside the function
    usrgroup = result.sheet1;
    console.log(usrgroup);
  /*chec db if(result ===null) 
       return usergroupname already exist
       else: call API     
  */
    await client.connect();
    const database = client.db("gardeniadb");
    const collection = database.collection("UserGroup");
    

    for (var i = 0; i < usrgroup.length; i++) {
        const query = { name: usrgroup[i].teamName};
     //console.log(query);
      const UG = await collection.findOne(query);
      // since this method returns the matched document, not a cursor, print it directly
      if(UG === null){
        console.log(usrgroup[i].teamName + "not exist");

        const res = await axios.post(url, {
        channel: 'general',
        name: usrgroup[i].teamName
        }, { headers: { authorization: `Bearer ${slackToken}` } });

    console.log('Done', res.data);
    // show the output before save it in db
    // save output in obj variable 
    if(!res.data) return;
    var obj = res.data;

    //if(res.data.ok === true){
        console.log(obj.usergroup.name + " is created");
    //}
    
    //create new logger and log it as
    
    //if usergroup is created already
    var groups = new UserGroup({ name: obj.usergroup.name, id: obj.usergroup.id, status: "active" });
    await groups.save(function (err) {
    if (err) return handleError(err);
      console.log("this document is saved");
    });
}else{
    console.log(usrgroup[i].teamName + " already exist");
}
    }
}



