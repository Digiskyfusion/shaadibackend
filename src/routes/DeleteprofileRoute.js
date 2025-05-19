const express = require('express');
const router = express.Router();
const DeleteUser= require("../controller/Deleteprofile")
const protect= require("../middleware/authMiddleware")


router.route('/delete-profile').post(protect,DeleteUser);

module.exports = router;