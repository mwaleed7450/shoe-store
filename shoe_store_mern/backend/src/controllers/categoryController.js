const Category = require('../models/Category');
const Product = require('../models/Product');

// GET /api/categories (public)
async function listCategories(req, res) {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    return res.json({ success: true, categories });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error fetching categories.' });
  }
}

// GET /api/admin/categories (admin, with product counts)
async function adminListCategories(req, res) {
  try {
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    const withCounts = await Promise.all(
      categories.map(async (c) => ({
        ...c,
        productCount: await Product.countDocuments({ category: c._id }),
      }))
    );
    return res.json({ success: true, categories: withCounts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error fetching categories.' });
  }
}

// POST /api/admin/categories
async function adminCreateCategory(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) return res.json({ success: true, category: existing }); // INSERT IGNORE behavior

    const category = await Category.create({ name: name.trim() });
    return res.status(201).json({ success: true, category });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error creating category.' });
  }
}

// DELETE /api/admin/categories/:id
async function adminDeleteCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    await category.deleteOne();
    // Match original PHP behavior (ON DELETE SET NULL)
    await Product.updateMany({ category: req.params.id }, { $set: { category: null } });

    return res.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error deleting category.' });
  }
}

module.exports = { listCategories, adminListCategories, adminCreateCategory, adminDeleteCategory };
