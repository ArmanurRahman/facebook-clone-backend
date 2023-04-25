const express = require("express");
const { register, activate } = require("../controllers/user");
const router = express.Router();

router.post("/user/register", register);
router.post("/user/activate", activate);

module.exports = router;
