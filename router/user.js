const express = require("express");
const {
    register,
    activate,
    login,
    resendVerificationEmail,
} = require("../controllers/user");
const { authUser } = require("../middleware/auth");
const router = express.Router();

router.post("/user/register", register);
router.post("/user/activate", authUser, activate);
router.post("/user/login", login);
router.post("/user/resendValidationEmail", authUser, resendVerificationEmail);
module.exports = router;
