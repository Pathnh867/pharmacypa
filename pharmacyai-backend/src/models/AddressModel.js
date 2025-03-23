// models/AddressModel.js
const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  label: { type: String, default: 'Nhà' }, // 'Nhà', 'Công ty', 'Khác'
}, {
  timestamps: true
});

module.exports = mongoose.model('Address', AddressSchema);