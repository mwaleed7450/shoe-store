import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { formatPrice, formatDate } from '../../utils/format';
import { adminApi } from '../../api/axios';

const statuses = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') || 'all';

  useEffect(() => {
    setLoading(true);
    const params = status !== 'all' ? { status } : {};
    adminApi.get('/admin/orders', { params }).then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));
  }, [status]);

  return (
    <AdminLayout title="Orders">
      <div className="category-pills" style={{ textAlign: 'left' }}>
        {statuses.map((s) => (
          <button
            key={s}
            className={`category-pill ${status === s ? 'active' : ''}`}
            style={{ border: 'none', textTransform: 'capitalize' }}
            onClick={() => setSearchParams(s === 'all' ? {} : { status: s })}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="admin-table-card">
        {loading ? <p className="text-muted">Loading...</p> : (
          <table className="admin-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Phone</th><th>Amount</th><th>Status</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.customerName}</td>
                  <td>{o.customerPhone}</td>
                  <td>{formatPrice(o.totalAmount)}</td>
                  <td style={{ textTransform: 'capitalize' }}>{o.status}</td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td><Link to={`/admin/orders/${o._id}`} className="btn btn-sm btn-outline">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && orders.length === 0 && <p className="text-muted">No orders found.</p>}
      </div>
    </AdminLayout>
  );
}
