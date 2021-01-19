const axios = require("axios");
const excelToJson = require("convert-excel-to-json");
("use strict");
var mongoDB = process.env.dburl;
var UserGroup = require("../models/usrgroup");
const slackToken = process.env.token;
let mongoose = require("mongoose");
const {
    MongoClient
} = require("mongodb");

const client = new MongoClient(process.env.dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//connecting to the database
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

exports.CreateUG = async (file) => {
    var message = "";
    //read excel file and convert it to json form
    const result = excelToJson({
        sourceFile: file.path,
        header: {
            rows: 1,
        },
        columnToKey: {
            A: "firstName",
            B: "lastName",
            C: "email",
            D: "teamName",
        },
    });

    //remover repetition in teamName field and save it in an array
    let arrUsrGroup = [];
    for (var j = 0; j < result.sheet1.length; j++) {
        if (arrUsrGroup.indexOf(result.sheet1[j].teamName) == -1) {
            arrUsrGroup.push(result.sheet1[j].teamName);
        }
    }

    let usrgroup = arrUsrGroup;
    await client.connect();
    const database = client.db("gardeniadb");
    const collection = database.collection("UserGroup");

    for (var i = 0; i < usrgroup.length; i++) {
        const query = {
            name: usrgroup[i]
        };
        // search for usergroup name in db
        let UG = await UserGroup.findOne(query);

        // if usergroup name not exist the call API to create it
        if (!UG) {

            let res = await axios.post(
            process.env.slackcreateusergroupapi, {
                    channel: "general",
                    name: usrgroup[i],
                }, {
                    headers: {
                        authorization: `Bearer ${slackToken}`
                    }
                }
            );
            if (!res.data) return;
            if (res.data.ok == false) return;
            var userGroup = res.data.usergroup;

            // add new usergroup to local db with status:active
            await UserGroup.create({
                    name: userGroup.name,
                    id: userGroup.id,
                    status: "active"
                },
                (err, data) => {
                    message += `${userGroup.name} is updated <br/>`;

                }
            );
        } else {
            message += `${usrgroup[i]} already exist <br/>`;
        }
    }
    return message;
};