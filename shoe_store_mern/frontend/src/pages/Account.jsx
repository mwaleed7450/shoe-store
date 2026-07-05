import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { formatPrice, formatDate } from '../utils/format';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  pending: '#f0ad4e', confirmed: '#5bc0de', shipped: '#8a6d00', delivered: '#28a745', cancelled: '#c0392b',
};

export default function Account() {
  const { customer, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="section-title">MY ACCOUNT</h2>

        <div className="auth-card" style={{ maxWidth: 700 }}>
          <h5 className="mb-3">Profile</h5>
          <p><strong>Name:</strong> {customer?.name}</p>
          <p><strong>Email:</strong> {customer?.email}</p>
          <p><strong>Phone:</strong> {customer?.phone || '-'}</p>
          <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
        </div>

        <div className="auth-card" style={{ maxWidth: 700 }}>
          <h5 className="mb-3">Order History</h5>
          {loading && <p className="text-muted">Loading...</p>}
          {!loading && orders.length === 0 && <p className="text-muted">You haven't placed any orders yet.</p>}
          {orders.map((o) => (
            <div key={o._id} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>#{o._id.slice(-8).toUpperCase()}</strong>
                <span style={{ color: statusColors[o.status], fontWeight: 700, textTransform: 'capitalize' }}>{o.status}</span>
              </div>
              <p className="text-muted" style={{ margin: '4px 0' }}>{formatDate(o.createdAt)} &middot; {o.items.length} item(s)</p>
              <p style={{ margin: 0 }}>{formatPrice(o.totalAmount)}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
