const sendMail = require("../utils/emailSender");
const mongoose = require("mongoose");
const User = require("../model/user");

const clickButton = async (req, res) => {
  try {
    const viewerEmail = req.user?._id; // Ensure req.user is defined

    const { id } = req.body; // ID of the profile clicked

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Get details of the clicked user
    const clickedUser = await User.findById(id).select("firstName lastName emailId mobileNumber");

    if (!clickedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const fullName = `${clickedUser.firstName} ${clickedUser.lastName}`;

    const html = `
      <p><strong>${viewerEmail}</strong> clicked the <strong>Connect</strong> button on the following profile:</p>
      <ul>
        <li><strong>Name:</strong> ${fullName}</li>
        <li><strong>Email:</strong> ${clickedUser.emailId}</li>
        <li><strong>Mobile Number:</strong> ${clickedUser.mobileNumber}</li>
      </ul>
    `;

    await sendMail({
      to: process.env.EMAIL_USER,
      subject: "🔔 Connect Button Clicked",
      html,
    });

    res.status(200).json({ message: "Admin notified successfully" });
  } catch (error) {
    console.error("Error sending mail:", error);
    res.status(500).json({ message: "Failed to notify admin" });
  }
};


module.exports= {clickButton};