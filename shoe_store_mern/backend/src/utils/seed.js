require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const AdminUser = require('../models/AdminUser');
const Category = require('../models/Category');

async function seed() {
  await connectDB();

  const username = process.env.SEED_ADMIN_USERNAME || 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await AdminUser.findOne({ username });
  if (!existingAdmin) {
    const hash = await bcrypt.hash(password, 10);
    await AdminUser.create({ username, password: hash, fullName: 'Store Admin' });
    console.log(`Admin user created -> username: ${username} / password: ${password}`);
    console.log('Change this password immediately after first login!');
  } else {
    console.log('Admin user already exists, skipping.');
  }

  const defaultCategories = ['Men', 'Women', 'Kids', 'Sports', 'Sale'];
  for (const name of defaultCategories) {
    await Category.findOneAndUpdate({ name }, { name }, { upsert: true });
  }
  console.log('Default categories ensured:', defaultCategories.join(', '));

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
