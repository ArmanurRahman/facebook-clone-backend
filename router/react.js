const express = require("express");
const { react, getReacts } = require("../controllers/react");
const { authUser } = require("../middleware/auth");

const router = express.Router();

router.put("/reactPost", authUser, react);
router.get("/getReacts/:id", authUser, getReacts);

module.exports = router;
