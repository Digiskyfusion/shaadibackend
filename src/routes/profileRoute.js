const express= require("express");
const router= express.Router()
const userProfile= require("../controller/profileController")
const protect= require("../middleware/authMiddleware")

router.route("/profile").post(protect,userProfile.createProfile)
router.route("/profile/:userId").post(protect,userProfile.getProfile)

module.exports= router;