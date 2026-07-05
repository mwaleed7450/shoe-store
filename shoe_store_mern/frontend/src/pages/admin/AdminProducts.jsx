import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { formatPrice } from '../../utils/format';
import { adminApi } from '../../api/axios';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminApi.get('/admin/products').then((res) => setProducts(res.data.products)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    await adminApi.delete(`/admin/products/${id}`);
    load();
  }

  return (
    <AdminLayout title="Products">
      <div className="admin-table-card">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Link to="/admin/products/new" className="btn btn-dark btn-sm"><i className="bi bi-plus-lg"></i> Add Product</Link>
        </div>
        {loading ? <p className="text-muted">Loading...</p> : (
          <table className="admin-table">
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td><img src={p.image || 'https://placehold.co/50x50'} className="product-thumb" alt={p.name} /></td>
                  <td>{p.name}</td>
                  <td>{p.category?.name || '-'}</td>
                  <td>{p.discountPrice ? <><s>{formatPrice(p.price)}</s> {formatPrice(p.discountPrice)}</> : formatPrice(p.price)}</td>
                  <td>{p.stock}</td>
                  <td><span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>{p.status}</span></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link to={`/admin/products/${p._id}/edit`} className="btn btn-sm btn-outline">Edit</Link>{' '}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && products.length === 0 && <p className="text-muted">No products yet.</p>}
      </div>
    </AdminLayout>
  );
}
