const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: null },
    stock: { type: Number, required: true, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    // Cloudinary image info
    image: { type: String, default: '' }, // secure_url
    imagePublicId: { type: String, default: '' }, // for deletion on update/delete
    sizes: { type: String, default: '' }, // comma separated, e.g. "38,39,40"
    status: { type: String, enum: ['active', 'hidden'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
