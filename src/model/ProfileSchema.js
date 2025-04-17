const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
 userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assumes you have a User model
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  liveWithFamily: {
    type: Boolean,
    required: true,
  },
  livingInIndiaSince: {
    type: String,
    required: true,
  },
  maritalStatus: {
    type: String,
    required: true,
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
  },
  diet: {
    type: String,
    required: true,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Other'],
  },
  height: {
    type: String,
    required: true,
  },
  subCommunity: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
