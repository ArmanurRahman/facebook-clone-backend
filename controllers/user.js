const User = require("../model/user");

exports.register = async (req, res) => {
    const {
        firstName,
        lastName,
        userName,
        email,
        password,
        bYear,
        bMonth,
        bDay,
        gender,
    } = req.body;
    const user = await new User({
        firstName,
        lastName,
        userName,
        email,
        password,
        bYear,
        bMonth,
        bDay,
        gender,
    }).save();

    res.json(user);
};
