var ITEM = require('../models/Item');


exports.findAllItems = async () => {
    return await ITEM.find((error, data) => {
        return data;
    });
}

exports.addItems = async (name, description) => {
    try {
        let itm = new ITEM();
        itm.name = name;
        itm.description = description;
        return await itm.save();
    } catch (error) {
        console.log(error);
    }
}

exports.removeItems = (name) => {
      try {
        ITEM.remove({name:name}).then((value)=>{
            console.log('result '+value);});
      } catch (error) {
          console.log(error);
      }   
    
}