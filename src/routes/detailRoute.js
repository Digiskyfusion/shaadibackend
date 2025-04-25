const express = require('express');
const router = express.Router();
const profileDetail = require("../controller/completeProfile")

router.route('/create').post(profileDetail.create);
router.route('/alluser').get(profileDetail.allUsers);
router.route('/getuser/:userId').get(profileDetail.getById);
router.route('/updateuser/:userId').put(profileDetail.updateuserById);
router.route('/deleteuser/:userId').delete(profileDetail.deleteUserById);

module.exports = router;
