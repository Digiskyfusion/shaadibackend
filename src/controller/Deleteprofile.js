  
  const User = require('../model/user');
  const Profile = require('../model/ProfileSchema');
  const PartnerPreference = require('../model/PatnerSchema');
  const DeletedUser = require('../model/DeleteProfiles');
  const otpGenerator = require('otp-generator');
  const twilio = require('twilio');
  const jwt = require('jsonwebtoken');
  const sendMailNodemailer = require('../utils/emailSender.js'); // 👈 Import the utility
  const receipt = require("../model/reciept.js")

  const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();


  //  const DeleteUser=async (req, res) => {
  //   const userId = req.user._id;
  //   console.log("userId", userId);
    
  //   const { reason } = req.body;

  //   if (!reason) {
  //     return res.status(400).json({ message: 'Reason is required' });
  //   }

  //   try {
  //     const user = await User.findById(userId);
  //     console.log(user);
      
  //     console.log(user.firstName);
      
  //     if (!user) return res.status(404).json({ message: 'User not found' });

  //     // 1. Save reason in DeletedUser collection
  //     await DeletedUser.create({ userId, reason , firstName:user.firstName, lastName:user.lastName,mobileNumber:user.mobileNumber,emailId:user.emailId,gender:user.gender });

  //     // 2. Delete from User, Profile, PartnerPreference
  //     await User.findByIdAndDelete(userId);
  //     await Profile.findOneAndDelete({ userId });
  //     await PartnerPreference.findOneAndDelete({ userId });

  //     res.status(200).json({ message: 'Profile and related data deleted successfully' });
  //   } catch (error) {
  //     console.error('Error deleting profile:', error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // };


  // controllers/userController.js

  const DeleteUser = async (req, res) => {
    const targetUserId = req.params.userId;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Reason is required' });
    }

    try {
      const user = await User.findById(targetUserId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Archive user data BEFORE deletion
      await DeletedUser.create({
        userId: user._id,
        reason,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.mobileNumber,
        emailId: user.emailId,
        gender: user.gender,
      });
await sendMailNodemailer({
  to: user.emailId,
  subject: "Your Shaadi Sanskar Account Has Been Deleted",
  text: "Your account has been deleted.",
  html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fff3f3; padding: 40px 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <h2 style="color: #b71c1c; font-size: 24px; margin-bottom: 20px;">Account Deleted – Shaadi Sanskar</h2>
      <p style="font-size: 16px; color: #444;">Dear ${user.firstName} ${user.lastName},</p>
      <p style="font-size: 16px; color: #444;">This is to confirm that your account on <strong>Shaadi Sanskar</strong> has been <strong style="color: #b71c1c;">successfully deleted</strong>.</p>
      
      <p style="font-size: 16px; color: #444;">We’re sorry to see you go, and we sincerely hope your journey toward companionship continues with joy and success.</p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      
      <p style="font-size: 14px; color: #777;">If this was a mistake or you wish to rejoin, feel free to contact our support team anytime.</p>
      <p style="font-size: 14px; margin-top: 20px; color: #777;">Warm regards,<br/><strong style="color: #b71c1c;">The Shaadi Sanskar Team</strong></p>
    </div>
  </div>
  `
});

      

      // Now delete user and related collections
      await User.findByIdAndDelete(targetUserId);
      await Profile.findOneAndDelete({ userId: targetUserId });
      await PartnerPreference.findOneAndDelete({ userId: targetUserId });
      await receipt.findOneAndDelete({ userId: targetUserId });

      res.status(200).json({ message: 'Profile and related data deleted successfully' });
    } catch (error) {
      console.error('Error deleting profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };




  const requestDeleteProfile = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);

      if (!user) return res.status(404).json({ message: 'User not found' });

      const emailOTP = generateOTP();
      const phoneOTP = generateOTP();

      user.deleteEmailOTP = emailOTP;
      user.deletePhoneOTP = phoneOTP;
      user.isDeleteEmailOTPVerified = false;
      user.isDeletePhoneOTPVerified = false;
      await user.save();

      // Send Email OTP
      if (user.emailId) {
        await sendEmail({
          to: user.emailId,
          subject: 'Delete Profile - OTP Verification',
          text: `Your OTP for profile deletion is: ${emailOTP}`
        });
      }

      // Send SMS OTP
      if (user.mobileNumber) {
        await twilioClient.messages.create({
          body: `Your OTP for profile deletion is: ${phoneOTP}`,
          from: process.env.TWILIO_PHONE,
          to: `+91${user.mobileNumber}`,
        });
      }

      res.status(200).json({ message: 'OTP sent to email and phone for profile deletion confirmation' });

    } catch (error) {
      console.error('Error sending OTP for delete:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  // controllers/userController.js

  const confirmDeleteProfile = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const { emailOTP, phoneOTP } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);

      if (!user) return res.status(404).json({ message: 'User not found' });

      const emailMatch = user.deleteEmailOTP === emailOTP;
      const phoneMatch = user.deletePhoneOTP === phoneOTP;

      if (!emailMatch || !phoneMatch) {
        return res.status(400).json({
          message: 'Invalid OTP(s)',
          emailOTPMatch: emailMatch,
          phoneOTPMatch: phoneMatch,
        });
      }

      // Optionally archive user data before deletion
      // await DeletedUser.create({ ...user.toObject(), deletedAt: new Date() });

      await user.deleteOne();

      res.status(200).json({ message: 'Profile deleted successfully' });

    } catch (error) {
      console.error('Error verifying delete OTP:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  const resendDeleteOTPs = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);

      if (!user) return res.status(404).json({ message: 'User not found' });

      const emailOTP = generateOTP();
      const phoneOTP = generateOTP();

      user.deleteEmailOTP = emailOTP;
      user.deletePhoneOTP = phoneOTP;
      user.isDeleteEmailOTPVerified = false;
      user.isDeletePhoneOTPVerified = false;
      await user.save();

      // Resend Email OTP
      if (user.emailId) {
        await sendEmail({
          to: user.emailId,
          subject: 'Resend OTP - Delete Profile Confirmation',
          text: `Your new OTP for profile deletion is: ${emailOTP}`,
        });
      }

      // Resend Phone OTP via SMS
      if (user.mobileNumber) {
        await twilioClient.messages.create({
          body: `Your new OTP for profile deletion is: ${phoneOTP}`,
          from: process.env.TWILIO_PHONE,
          to: `+91${user.mobileNumber}`,
        });
      }

      res.status(200).json({ message: 'New OTPs sent to email and phone' });

    } catch (error) {
      console.error('Error resending delete OTP:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  module.exports= {DeleteUser, requestDeleteProfile,confirmDeleteProfile ,resendDeleteOTPs};