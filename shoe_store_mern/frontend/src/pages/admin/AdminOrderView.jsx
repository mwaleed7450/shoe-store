import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { formatPrice, formatDate } from '../../utils/format';
import { adminApi } from '../../api/axios';

const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrderView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  function load() {
    adminApi.get(`/admin/orders/${id}`).then((res) => setOrder(res.data.order)).catch(() => navigate('/admin/orders'));
  }

  useEffect(() => { load(); }, [id]);

  async function handleStatusChange(e) {
    setUpdating(true);
    try {
      await adminApi.patch(`/admin/orders/${id}/status`, { status: e.target.value });
      load();
    } finally {
      setUpdating(false);
    }
  }

  if (!order) return <AdminLayout title="Order Details"><p className="text-muted">Loading...</p></AdminLayout>;

  return (
    <AdminLayout title={`Order #${order._id.slice(-8).toUpperCase()}`}>
      <div className="admin-table-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
          <div>
            <h6 className="fw-bold">Customer</h6>
            <p style={{ margin: 0 }}>{order.customerName}</p>
            <p style={{ margin: 0 }}>{order.customerPhone}</p>
            <p style={{ margin: 0 }}>{order.customerEmail || '-'}</p>
            <p style={{ margin: 0 }}>{order.customerAddress}</p>
          </div>
          <div>
            <h6 className="fw-bold">Order Info</h6>
            <p style={{ margin: 0 }}>Date: {formatDate(order.createdAt)}</p>
            <p style={{ margin: 0 }}>Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
            <div className="form-group mt-2" style={{ maxWidth: 200 }}>
              <label className="form-label">Status</label>
              <select className="form-select" value={order.status} onChange={handleStatusChange} disabled={updating}>
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <h6 className="fw-bold">Items</h6>
        <table className="admin-table">
          <thead><tr><th>Product</th><th>Size</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>{item.productName}</td>
                <td>{item.size || '-'}</td>
                <td>{formatPrice(item.price)}</td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h5 className="text-center mt-3">Total: {formatPrice(order.totalAmount)}</h5>
      </div>
    </AdminLayout>
  );
}
