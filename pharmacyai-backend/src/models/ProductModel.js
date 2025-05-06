const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        rating: { type: Number, required: true },
        description: { type: String },
        discount: { type: Number },
        selled: { type: Number },
        requiresPrescription: { type: Boolean, default: false },
        prescriptionDetails: {
            activeIngredients: { type: String },
            dosage: { type: String },
            interactions: { type: String },
            sideEffects: { type: String }
        }
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model('Product', productSchema);
module.exports = Product;