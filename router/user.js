const express = require("express");
const { register, activate, login } = require("../controllers/user");
const router = express.Router();

router.post("/user/register", register);
router.post("/user/activate", activate);
router.post("/user/login", login);

module.exports = router;
