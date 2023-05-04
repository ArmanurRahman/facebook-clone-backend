const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const code = mongoose.Schema({
    code: {
        type: String,
        required: [true, "code can't be empty"],
        max: [5, "code can't be more than 5 character"],
        min: [5, "code can't be less than 5 character"],
    },
    user: {
        type: ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Code", code);
