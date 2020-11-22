let mongoose = require("mongoose");

let schema = mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    }

}, {
    versionKey: false,
    timestamps: true
}
);

module.exports = mongoose.model("ITEM", schema, "ITEM");

