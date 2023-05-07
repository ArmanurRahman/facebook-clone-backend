const express = require("express");
const { uploadImages } = require("../controllers/upload");
const imageUpload = require("../middleware/imageUpload");

const router = express.Router();

router.post("/uploadImage", imageUpload, uploadImages);

module.exports = router;
