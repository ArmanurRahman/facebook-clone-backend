const mongoose = require("mongoose");
const Post = require("../model/post");
const User = require("../model/user");

exports.createPost = async (req, res) => {
    try {
        const post = await new Post(req.body).save();
        await post.populate(
            "user",
            "firstName lastName userName gender picture"
        );
        return res.status(201).json(post);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.getAllPost = async (req, res) => {
    try {
        const followingObj = await User.findById(req.user.id, {
            following: 1,
        });
        const following = followingObj.following || [];
        following.push(new mongoose.Types.ObjectId(req.user.id));
        const post = await Post.find({ user: { $in: following } })
            .populate("user", "firstName lastName userName gender picture")
            .populate(
                "comments.commentBy",
                "firstName lastName picture userName"
            )
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
                        commentAt: new Date(),
                    },
                },
            },
            {
                new: true,
            }
        ).populate("comments.commentBy", "firstName lastName picture userName");
        res.json(newComments.comments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
