const User = require("../model/user");
const Code = require("../model/code");
const Post = require("../model/post");
const validator = require("../helpers/validate");
const tokenGenerator = require("../helpers/token");
const crypt = require("bcrypt");
const {
    sendVerificationMail,
    sendVerificationCode,
} = require("../helpers/mailer");
const jwt = require("jsonwebtoken");
const generateCode = require("../helpers/generateCode");

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
            "1d"
        );
        const url = `${process.env.BASE_URL}/activate/${emailVarificationToken}`;
        sendVerificationMail(user.email, user.firstName, url);

        const token = tokenGenerator.generateToken({ id: user._id }, "7d");

        res.status(201).json({
            id: user._id.toString(),
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

exports.resendVerificationEmail = async (req, res) => {
    const { user } = req;
    try {
        const currentUser = await User.findOne({ _id: user.id });
        const emailVarificationToken = tokenGenerator.generateToken(
            { id: user.id.toString() },
            "1d"
        );
        const url = `${process.env.BASE_URL}/activate/${emailVarificationToken}`;
        sendVerificationMail(currentUser.email, currentUser.firstName, url);
        return res
            .status(200)
            .json({ message: "verification email has been sent" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.activate = async (req, res) => {
    try {
        const { token } = req.body;
        const user = jwt.verify(token, process.env.SECRET_KEY);
        const result = await User.findById(user.id);
        const validUser = req.user.id;

        if (validUser !== user.id) {
            return res.status(400).json({
                message: "You don't have permission to perform this action",
            });
        }
        if (result.verified) {
            return res
                .status(400)
                .json({ message: "the email already activated" });
        }

        await User.findByIdAndUpdate(user.id, { verified: true });
        return res.status(200).json({ message: "accout has been activated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "this email is not connected to any accout" });
        }

        const isValidPass = await crypt.compare(password, user.password);
        if (!isValidPass) {
            return res.status(400).json({ message: "invalid credential" });
        }

        const token = tokenGenerator.generateToken({ id: user._id }, "7d");
        return res.status(200).json({
            id: user._id.toString(),
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
            verified: user.verified,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select("-password");
        if (!user) {
            return res
                .status(400)
                .json({ message: "No account find for this email" });
        }
        return res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.sendValidationCode = async (req, res) => {
    try {
        const { email } = req.body;
        const code = generateCode(5);
        const user = await User.findOne({ email }).select("-password");
        await Code.findOneAndDelete({ user: user._id });

        const saveCode = await new Code({
            user: user._id,
            code,
        }).save();
        sendVerificationCode(user.email, user.firstName, code);
        return res
            .status(200)
            .json({ message: "verification code has been sent" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.checkValidationCode = async (req, res) => {
    try {
        const { code, email } = req.body;

        const user = await User.findOne({ email }).select("-password");
        const dbCode = await Code.findOne({ user: user._id });

        if (code !== dbCode.code) {
            return res
                .status(400)
                .json({ message: "validation code doesn't match" });
        }
        return res.status(200).json({ message: "code validated" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashPass = await crypt.hash(password, 12);
        await User.findOneAndUpdate({ email }, { password: hashPass });
        res.status(200).json({ message: "ok" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const { userName } = req.params;
        const profile = await User.findOne({ userName })
            .select("-password")
            .lean()
            .exec();
        if (!profile) {
            return res.status(404).json({ message: "profile not found" });
        }
        const posts = await Post.find({ user: profile._id })
            .sort({ createdAt: "desc" })
            .populate("user");
        profile.posts = posts;
        return res.status(200).json(profile);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.uploadProfilePicture = async (req, res) => {
    try {
        const { url } = req.body;
        await User.findByIdAndUpdate(req.user.id, {
            picture: url,
        });
        return res.status(200).json(url);
    } catch (error) {}
};
