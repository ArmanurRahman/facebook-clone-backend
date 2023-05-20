const Post = require("../model/post");

exports.createPost = async (req, res) => {
    try {
        const post = await new Post(req.body).save();
        return res.status(201).json(post);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.getAllPost = async (req, res) => {
    try {
        const post = await Post.find()
            .populate("user", "firstName lastName userName gender picture")
            .sort({ createdAt: "desc" });
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.comment = async (req, res) => {
    try {
        const { comment, image, postId } = req.body;
        let newComments = await Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        comment: comment,
                        image: image,
                        commentBy: req.user.id,
                    },
                },
            },
            {
                new: true,
            }
        ).populate(
            "comments.commentBy",
            "picture first_name last_name username"
        );
        res.json(newComments.comments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
