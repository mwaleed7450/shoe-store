const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// GET /api/products  (public) ?category=&q=
async function listProducts(req, res) {
  try {
    const { category, q } = req.query;
    const filter = { status: 'active' };
    if (category) filter.category = category;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const products = await Product.find(filter).populate('category', 'name').sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error fetching products.' });
  }
}

// GET /api/products/featured (public) - for homepage
async function featuredProducts(req, res) {
  try {
    const products = await Product.find({ status: 'active' })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(8);
    return res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error fetching featured products.' });
  }
}

// GET /api/products/:id (public) - detail + related
async function getProduct(req, res) {
  try {
    const product = await Product.findOne({ _id: req.params.id, status: 'active' }).populate('category', 'name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    let related = [];
    if (product.category) {
      related = await Product.find({
        category: product.category._id,
        _id: { $ne: product._id },
        status: 'active',
      }).limit(4);
    }

    return res.json({ success: true, product, related });
  } catch (err) {
    console.error(err);
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
}

// ===== Admin =====

// GET /api/admin/products
async function adminListProducts(req, res) {
  try {
    const products = await Product.find({}).populate('category', 'name').sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error fetching products.' });
  }
}

// POST /api/admin/products  (multipart, field "image")
async function adminCreateProduct(req, res) {
  try {
    const { name, description, price, discountPrice, stock, category, sizes, status } = req.body;

    if (!name || !price || Number(price) <= 0) {
      return res.status(400).json({ success: false, message: 'Please fill in product name and a valid price.' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a product image.' });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description?.trim() || '',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: Number(stock) || 0,
      category: category || null,
      image: req.file.path, // Cloudinary secure_url
      imagePublicId: req.file.filename, // Cloudinary public_id
      sizes: sizes?.trim() || '',
      status: status === 'hidden' ? 'hidden' : 'active',
    });

    return res.status(201).json({ success: true, product });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error creating product.' });
  }
}

// PUT /api/admin/products/:id (multipart, optional "image")
async function adminUpdateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const { name, description, price, discountPrice, stock, category, sizes, status } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = discountPrice ? Number(discountPrice) : null;
    if (stock !== undefined) product.stock = Number(stock);
    if (category !== undefined) product.category = category || null;
    if (sizes !== undefined) product.sizes = sizes.trim();
    if (status !== undefined) product.status = status === 'hidden' ? 'hidden' : 'active';

    if (req.file) {
      // remove old cloudinary image
      if (product.imagePublicId) {
        cloudinary.uploader.destroy(product.imagePublicId).catch(() => {});
      }
      product.image = req.file.path;
      product.imagePublicId = req.file.filename;
    }

    if (!product.name || product.price <= 0) {
      return res.status(400).json({ success: false, message: 'Please fill in product name and a valid price.' });
    }

    await product.save();
    return res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error updating product.' });
  }
}

// DELETE /api/admin/products/:id
async function adminDeleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    if (product.imagePublicId) {
      cloudinary.uploader.destroy(product.imagePublicId).catch(() => {});
    }
    await product.deleteOne();

    return res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error deleting product.' });
  }
}

module.exports = {
  listProducts,
  featuredProducts,
  getProduct,
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
};
