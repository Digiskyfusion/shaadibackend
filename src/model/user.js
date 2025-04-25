const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  profileFor: String,
  firstName: String,
  lastName: String,
  religion: String,
  community: String,
  mobileNumber: String,
  emailId: String,
  dob: Date,
  location: String,
  password: String,
  emailOTP: String,
  phoneOTP: String,
  image:String,
  isVerifiedEmail: { type: Boolean, default: false },
  isVerifiedPhone: { type: Boolean, default: false },
}, { timestamps: true }); // optional: adds createdAt & updatedAt fields

module.exports = mongoose.model("User", userSchema);
