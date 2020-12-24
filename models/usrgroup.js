let mongoose = require("mongoose");

let schema = mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    id: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: ""
    }
}
);

module.exports = mongoose.model("UserGroup", schema, "UserGroup");