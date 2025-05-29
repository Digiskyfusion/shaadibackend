const express = require("express");
const router = express.Router();
const contact= require("../controller/contact")


router.route("/").post(contact.createContact)
router.route("/getcontacts").get(contact.getContact)

module.exports= router;




