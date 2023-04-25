const User = require("../model/user");

exports.emailValidate = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

exports.lengthCheck = (string, min, max) => {
    return !(string.length > max || string.length < min);
};

exports.usernameValidation = async (userName) => {
    let isContinue = true;
    do {
        const existusername = await User.findOne({ userName });
        if (existusername) {
            userName += (+new Date() * Math.random())
                .toString()
                .substring(0, 1);
        } else {
            isContinue = false;
        }
    } while (isContinue);
    return userName;
};
