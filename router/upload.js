const express = require("express");
const { uploadImages, listImages } = require("../controllers/upload");
const imageUpload = require("../middleware/imageUpload");
const { authUser } = require("../middleware/auth");

const router = express.Router();

router.post("/uploadImages", imageUpload, uploadImages);
router.post("/listImages", authUser, listImages);

module.exports = router;
