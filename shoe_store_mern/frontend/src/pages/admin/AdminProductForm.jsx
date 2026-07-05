import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { adminApi } from '../../api/axios';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '', stock: '', category: '', sizes: '', status: 'active',
  });
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    adminApi.get('/admin/categories').then((res) => setCategories(res.data.categories));
    if (isEdit) {
      adminApi.get('/admin/products').then((res) => {
        const product = res.data.products.find((p) => p._id === id);
        if (product) {
          setForm({
            name: product.name,
            description: product.description || '',
            price: product.price,
            discountPrice: product.discountPrice || '',
            stock: product.stock,
            category: product.category?._id || '',
            sizes: product.sizes || '',
            status: product.status,
          });
          setCurrentImage(product.image);
        }
      });
    }
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.price) {
      setError('Please fill in product name and price.');
      return;
    }
    if (!isEdit && !imageFile) {
      setError('Please upload a product image.');
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (imageFile) data.append('image', imageFile);

    setSubmitting(true);
    try {
      if (isEdit) await adminApi.put(`/admin/products/${id}`, data);
      else await adminApi.post('/admin/products', data);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong saving the product.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
      <div className="admin-table-card" style={{ maxWidth: 700 }}>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input type="text" name="name" className="form-control" required value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Price (Rs.)</label>
              <input type="number" name="price" className="form-control" required min="0" value={form.price} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Discount Price (optional)</label>
              <input type="number" name="discountPrice" className="form-control" min="0" value={form.discountPrice} onChange={handleChange} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Stock</label>
              <input type="number" name="stock" className="form-control" min="0" value={form.stock} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                <option value="">-- None --</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Sizes (comma separated, e.g. 38,39,40)</label>
            <input type="text" name="sizes" className="form-control" value={form.sizes} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select name="status" className="form-select" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Product Image {isEdit && '(leave empty to keep current)'}</label>
            {currentImage && <div className="mb-2"><img src={currentImage} alt="current" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} /></div>}
            <input type="file" accept="image/png,image/jpeg,image/webp" className="form-control" onChange={(e) => setImageFile(e.target.files[0])} />
          </div>
          <button type="submit" className="btn btn-dark" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
