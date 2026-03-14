const mongoose = require('mongoose')

const voucherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: Number,
        required: true
    },
    pointsUsed: {
        type: Number,
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    expiredAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'used', 'expired'],
        default: 'active'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Voucher', voucherSchema)