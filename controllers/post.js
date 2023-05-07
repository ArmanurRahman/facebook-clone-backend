const Post = require("../model/post");

exports.createPost = async (req, res) => {
    try {
        const post = await new Post(req.body).save();
        return res.status(201).json(post);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
