import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminApi } from '../../api/axios';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function load() {
    adminApi.get('/admin/categories').then((res) => setCategories(res.data.categories));
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) return;
    try {
      await adminApi.post('/admin/categories', { name });
      setName('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category.');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category? Products in it will become uncategorized.')) return;
    await adminApi.delete(`/admin/categories/${id}`);
    load();
  }

  return (
    <AdminLayout title="Categories">
      <div className="admin-table-card" style={{ maxWidth: 500 }}>
        <h5 className="mb-3">Add Category</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8 }}>
          <input type="text" className="form-control" placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit" className="btn btn-dark">Add</button>
        </form>
      </div>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Products</th><th></th></tr></thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.productCount}</td>
                <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="text-muted">No categories yet.</p>}
      </div>
    </AdminLayout>
  );
}
