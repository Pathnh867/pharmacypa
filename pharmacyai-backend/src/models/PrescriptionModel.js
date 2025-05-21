const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prescriptionImage: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    note: { type: String },
    expiryDate: { type: Date },
},
    {
        timestamps: true,
    }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;