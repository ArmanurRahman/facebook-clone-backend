const express = require("express");
const { register, activate, login, testAuth } = require("../controllers/user");
const { authUser } = require("../middleware/auth");
const router = express.Router();

router.post("/user/register", register);
router.post("/user/activate", authUser, activate);
router.post("/user/login", login);
module.exports = router;
