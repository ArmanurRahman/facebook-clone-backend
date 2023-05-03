const jwt = require("jsonwebtoken");

exports.authUser = async (req, res, next) => {
    try {
        let temp = req.header("Authorization");

        const token = temp ? temp.slice(7, temp.lenght) : "";
        if (!token) {
            return res.status(400).json({ message: "Invalid Authentication" });
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "Invalid Authentication" });
            }
            res.user = user;
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
