const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {clickButton}= require("../controller/ButtonClickController")

router.route("/notify-admin-on-connect").post(protect,clickButton)

module.exports= router;