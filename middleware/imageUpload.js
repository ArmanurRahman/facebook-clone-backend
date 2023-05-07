const {
    SUPPORTED_IMAGE_FORMAT,
    MAX_FILE_SIZE,
} = require("../constants/constant");
const { removeTmp } = require("../helpers/utility");

module.exports = async function (req, res, next) {
    try {
        if (!req.files || Object.values(req.files).flat().length === 0) {
            return res.status(400).json({ message: "No files selected." });
        }
        let files = Object.values(req.files).flat();
        files.forEach((file) => {
            if (!SUPPORTED_IMAGE_FORMAT.includes(file.mimetype)) {
                removeTmp(file.tempFilePath);
                return res.status(400).json({ message: "Unsupported format" });
            }
            if (file.size > MAX_FILE_SIZE) {
                removeTmp(file.tempFilePath);
                return res
                    .status(400)
                    .json({ message: "File size is too large" });
            }
        });
        next();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
