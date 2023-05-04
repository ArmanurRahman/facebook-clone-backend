const express = require("express");
const {
    register,
    activate,
    login,
    resendVerificationEmail,
    findUser,
    sendValidationCode,
    checkValidationCode,
    changePassword,
} = require("../controllers/user");
const { authUser } = require("../middleware/auth");
const router = express.Router();

router.post("/user/register", register);
router.post("/user/activate", authUser, activate);
router.post("/user/login", login);
router.post("/user/resendValidationEmail", authUser, resendVerificationEmail);
router.post("/findUser", findUser);
router.post("/sendValidationCode", sendValidationCode);
router.post("/checkValidationCode", checkValidationCode);
router.post("/changePassword", changePassword);
module.exports = router;
