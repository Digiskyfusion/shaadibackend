 
const User = require('../model/user');
const Profile = require('../model/ProfileSchema');
const PartnerPreference = require('../model/PatnerSchema');
const DeletedUser = require('../model/DeleteProfiles');

 const DeleteUser=async (req, res) => {
  const userId = req.user.id;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ message: 'Reason is required' });
  }

  try {
    const user = await User.findById(userId);
    console.log(user.firstName);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Save reason in DeletedUser collection
    await DeletedUser.create({ userId, reason , name:user.firstName });

    // 2. Delete from User, Profile, PartnerPreference
    await User.findByIdAndDelete(userId);
    await Profile.findOneAndDelete({ userId });
    await PartnerPreference.findOneAndDelete({ userId });

    res.status(200).json({ message: 'Profile and related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports= DeleteUser;