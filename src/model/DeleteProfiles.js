const mongoose = require('mongoose');

const deletedUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:{type:String},
  reason: { type: String, required: true },
  deletedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeletedUser', deletedUserSchema);
