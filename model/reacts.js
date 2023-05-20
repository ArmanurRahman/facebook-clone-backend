const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const reacts = mongoose.Schema({
    react: {
        type: String,
        enum: ["like", "love", "sad", "angry", "wow", "haha"],
        required: true,
    },
    post: {
        type: ObjectId,
        ref: "Post",
        required: true,
    },
    reactedBy: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = mongoose.model("React", reacts);
