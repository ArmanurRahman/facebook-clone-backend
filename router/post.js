const express = require("express");
const {
    createPost,
    getAllPost,
    comment,
    savePost,
    deletePost,
} = require("../controllers/post");
const { authUser } = require("../middleware/auth");

const router = express.Router();

router.post("/createPost", authUser, createPost);
router.get("/getAllPost", authUser, getAllPost);
router.put("/comment", authUser, comment);
router.put("/savePost/:id", authUser, savePost);
router.put("/deletePost/:id", authUser, deletePost);

module.exports = router;
