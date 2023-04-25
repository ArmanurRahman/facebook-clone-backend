const User = require("../model/user");
const validator = require("../helpers/validate");
const tokenGenerator = require("../helpers/token");
const crypt = require("bcrypt");
const { sendVerificationMail } = require("../helpers/mailer");

exports.register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            bYear,
            bMonth,
            bDay,
            gender,
        } = req.body;
        if (!validator.emailValidate(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "Email already exist" });
        }

        if (!validator.lengthCheck(firstName, 2, 30)) {
            return res
                .status(400)
                .json({ message: "first name must be 2 ~ 30 character" });
        }

        if (!validator.lengthCheck(lastName, 2, 30)) {
            return res
                .status(400)
                .json({ message: "last name must be 2 ~ 30 character" });
        }

        if (!validator.lengthCheck(password, 6, 30)) {
            return res
                .status(400)
                .json({ message: "password must be 2 ~ 30 character" });
        }

        const hashPass = await crypt.hash(password, 12);

        const userName = await validator.usernameValidation(
            `${firstName}${lastName}`
        );
        const user = await new User({
            firstName,
            lastName,
            userName,
            email,
            password: hashPass,
            bYear,
            bMonth,
            bDay,
            gender,
        }).save();

        const emailVarificationToken = tokenGenerator.generateToken(
            { id: user._id.toString() },
            "30m"
        );
        const url = `${process.env.BASE_URL}/activate/${emailVarificationToken}`;
        sendVerificationMail(user.email, user.firstName, url);

        const token = tokenGenerator.generateToken({ id: user._id }, "7d");

        res.status(201).json({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
            verified: user.verified,
            token,
            message: "Registration success! Please active your email address",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
