// pharmacyai-backend/src/models/PrescriptionModel.js
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Có thể null nếu chưa tạo đơn hàng
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected', 'needs_info'],
      default: 'pending' 
    },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    notes: { type: String },
    rejectReason: { type: String },
    expiryDate: { type: Date }
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;