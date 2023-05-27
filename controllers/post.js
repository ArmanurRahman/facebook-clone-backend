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

exports.savePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const user = await User.findById(req.user.id);
        const check = user?.savePosts?.find(
            (post) => post.post.toString() === postId
        );
        if (check) {
            await User.findByIdAndUpdate(req.user.id, {
                $pull: {
                    savePosts: {
                        _id: check._id,
                    },
                },
            });
        } else {
            await User.findByIdAndUpdate(req.user.id, {
                $push: {
                    savePosts: {
                        post: postId,
                        savedAt: new Date(),
                    },
                },
            });
        }
        return res.status(200).json({ message: "ok" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndRemove(req.params.id);
        res.json({ status: "ok" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
