const React = require("../model/reacts");
const User = require("../model/user");
const mongoose = require("mongoose");

exports.react = async (req, res) => {
    const { react, postId } = req.body;
    try {
        const oldReact = await React.findOne({
            post: postId,
            reactedBy: new mongoose.Types.ObjectId(req.user.id),
        });
        if (oldReact) {
            if (oldReact.react === react) {
                await React.findByIdAndRemove(oldReact._id);
            } else {
                await React.findByIdAndUpdate(oldReact._id, {
                    react: react,
                });
            }
        } else {
            const newReact = new React({
                react: react,
                post: postId,
                reactedBy: req.user.id,
            });
            await newReact.save();
        }
        res.status(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getReacts = async (req, res) => {
    try {
        const reactsArray = await React.find({ post: req.params.id });

        const newReacts = reactsArray.reduce((group, react) => {
            let key = react.react;
            group[key] = group[key] || [];
            group[key].push(react);
            return group;
        }, {});

        const reacts = [
            {
                react: "like",
                count: newReacts.like ? newReacts.like.length : 0,
            },
            {
                react: "love",
                count: newReacts.love ? newReacts.love.length : 0,
            },
            {
                react: "haha",
                count: newReacts.haha ? newReacts.haha.length : 0,
            },
            {
                react: "sad",
                count: newReacts.sad ? newReacts.sad.length : 0,
            },
            {
                react: "wow",
                count: newReacts.wow ? newReacts.wow.length : 0,
            },
            {
                react: "angry",
                count: newReacts.angry ? newReacts.angry.length : 0,
            },
        ];

        const check = await React.findOne({
            post: req.params.id,
            reactedBy: req.user.id,
        });
        const user = await User.findById(req.user.id);
        const checkSaved = user?.savePosts?.find(
            (x) => x.post.toString() === req.params.id
        );
        res.json({
            reacts,
            check: check?.react,
            total: reactsArray.length,
            checkSaved: checkSaved ? true : false,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
