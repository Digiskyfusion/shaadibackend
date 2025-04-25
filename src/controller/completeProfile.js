const Profile = require('../model/userProfileDetails');



//create profile
const create = async (req, res) => {
    try {
      const { userId } = req.body;
  
      // Check if profile already exists for this userId
      const existingProfile = await Profile.findOne({ userId });
  
      if (existingProfile) {
        return res.status(400).json({ error: "Profile already exists for this user." });
      }
  
      const profile = new Profile(req.body);
      await profile.save();
      res.status(201).json(profile);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  //read all
  const allUsers= async (req, res) => {
    try {
      const profiles = await Profile.find();
      res.json(profiles);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// get by id
  const getById= async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.params.userId });
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
      res.json(profile);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  //update by id 
  const updateuserById=async (req, res) => {
    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: req.params.userId }, // filter
            req.body,                      // update
            {
              new: true,                   // return the updated document
              runValidators: true          // validate before update
            }
          );
      if (!updatedProfile) return res.status(404).json({ message: 'Profile not found' });
      res.json(updatedProfile);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  //delete by id 
  const deleteUserById= async (req, res) => {
    try {
      const deletedProfile = await Profile.findOneAndDelete({userId: req.params.userId});
      if (!deletedProfile) return res.status(404).json({ message: 'Profile not found' });
      res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }


  
  module.exports={create,allUsers,getById,updateuserById,deleteUserById}