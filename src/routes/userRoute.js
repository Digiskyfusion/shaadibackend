
const express= require("express");
const router = express.Router();
const authForm= require("../controller/mutliform")


router.route("/register").post(authForm.multiForm);
router.route("/login").post(authForm.login);


module.exports= router;