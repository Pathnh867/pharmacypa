const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: Number, required: true},
    },
    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: {type: Number, required: false},
    totalPrice: {type: Number, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    isPaid: {type: Boolean, default: false},
    paidAt: {type: Date},
    isDeliverd: {type: Boolean, default: false},
    deliverdAt: {type: Date},
    // Thêm trường trạng thái chi tiết cho đơn hàng
    status: {
        type: String, 
        enum: ['pending', 'processing', 'shipping', 'delivered', 'cancelled'],
        default: 'pending'
    },
    prescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription'
    },
    prescriptionStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'needs_info'],
        default: null
    },
    prescriptionVerified: {
        type: Boolean,
        default: false
    },
    // Lịch sử trạng thái
    statusHistory: [{
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipping', 'delivered', 'cancelled']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: {
            type: String
        }
    }],
    // Dự kiến giao hàng
    estimatedDeliveryDate: {
        type: Date
    }
},  {
    timestamps: true // Thêm timestamps để theo dõi thời gian tạo và cập nhật
},)

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;