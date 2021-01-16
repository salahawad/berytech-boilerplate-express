const slackToken =process.env.token;
const url = 'https://slack.com/api/usergroups.list';
const axios = require('axios');
const { MongoClient } = require("mongodb");
var mongoDB =process.env.dburl;
var UserGroup = require('../models/usrgroup');
const uri ="mongodb://localhost:27017/";
const client = new MongoClient(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

var mongoose = require('mongoose');
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

//run().catch(err => console.log(err));

exports.fetchUsrGroupList = async function () {
    
    await client.connect();
    const database = client.db("gardeniadb");
    const collection = database.collection("UserGroup");

    //deactivate all user group status in database
    const resul = await collection.updateMany({status: "active" }, {$set: {status: "deactive"} });
    console.log(resul.result.nModified + " documents deactivate its status in database");

    //call API to fetch usergroup list from slackworkspace
    const res = await axios.post(url, {
    }, { headers: { authorization: `Bearer ${slackToken}` } });
    //console.log(url+' call done', res.data);
    if(!res.data) return;

    var arrUserGroups = res.data.usergroups;
   
    var message="";
    for (var i = 0; i < arrUserGroups.length; i++) {
       var usrgroupName= arrUserGroups[i].name;
       
        query = {name: usrgroupName}

        // check if usergroup exist in local db
       const findUG = await collection.findOne(query);
        //if result == null usergroup not exist
        // add to db and activated status
        if (!findUG ){
            await UserGroup.create({ name: usrgroupName, id: arrUserGroups[i].id, status: "active" },(err,data)=>{
                message+= data.name+" this document is saved";
                message+="  ";
            });
            console.log(usrgroupName +  ' saved');
        }else{
            //update usergroup status to active
            const update = await collection.updateOne(query, {$set: {status: "active"} });
            message+=usrgroupName+ " activate its status";
            message+="  ";
        }
   }
   //console.log(message);
    return message;
}