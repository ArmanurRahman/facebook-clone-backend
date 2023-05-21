const express = require("express");
const {
    createPost,
    getAllPost,
    comment,
    savePost,
} = require("../controllers/post");
const { authUser } = require("../middleware/auth");

const router = express.Router();

router.post("/createPost", authUser, createPost);
router.get("/getAllPost", authUser, getAllPost);
router.put("/comment", authUser, comment);
router.put("/savePost/:id", authUser, savePost);

module.exports = router;
