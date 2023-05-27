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
    getProfile,
    uploadProfilePicture,
    uploadCoverPicture,
    updateUserDetails,
    addFriend,
    cancelRequest,
    follow,
    unfollow,
    acceptRequest,
    unfriend,
    deleteRequest,
    search,
    addToSearchHistory,
    getSearchHistory,
    removeFromSearch,
    getFriendsPageInfos,
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
router.get("/getProfile/:userName", authUser, getProfile);
router.put("/uploadProfilePicture", authUser, uploadProfilePicture);
router.put("/uploadCoverPicture", authUser, uploadCoverPicture);
router.put("/updateUserDetails", authUser, updateUserDetails);
router.put("/addFriend/:id", authUser, addFriend);
router.put("/cancelRequest/:id", authUser, cancelRequest);
router.put("/follow/:id", authUser, follow);
router.put("/unfollow/:id", authUser, unfollow);
router.put("/acceptRequest/:id", authUser, acceptRequest);
router.put("/unfriend/:id", authUser, unfriend);
router.put("/deleteRequest/:id", authUser, deleteRequest);
router.post("/search/:searchTerm", authUser, search);
router.put("/addToSearchHistory", authUser, addToSearchHistory);
router.get("/getSearchHistory", authUser, getSearchHistory);
router.put("/removeFromSearch", authUser, removeFromSearch);
router.get("/getFriendsPageInfos", authUser, getFriendsPageInfos);
module.exports = router;
