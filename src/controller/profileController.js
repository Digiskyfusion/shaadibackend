const profileModel = require("../model/ProfileSchema");

const createProfile = async (req, res) => {
  try {
    const {
      userId, // Get this from req.body or req.user (if using authentication)
      city,
      liveWithFamily,
      livingInIndiaSince,
      maritalStatus,
      diet,
      height,
      subCommunity,
    } = req.body;

     // Step 1: Check if profile already exists for this user
     const existingProfile = await profileModel.findOne({ userId });

     if (existingProfile) {
       return res.status(400).json({
         message: "User has already submitted profile.",
         data: existingProfile,
       });
     }

    const newProfile = await profileModel.create({
      userId,
      city,
      liveWithFamily,
      livingInIndiaSince,
      maritalStatus,
      diet,
      height,
      subCommunity,
    });

    res.status(201).json({
      message: "Profile created successfully!",
      data: newProfile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while creating the profile.",
      error: error.message,
    });
  }
};

// GET /api/profile/:userId
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await profileModel.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ data: profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



module.exports = {createProfile,getProfile}
