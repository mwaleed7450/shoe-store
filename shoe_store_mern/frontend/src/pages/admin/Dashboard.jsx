import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { formatPrice, formatDate } from '../../utils/format';
import { adminApi } from '../../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    adminApi.get('/admin/dashboard').then((res) => {
      setStats(res.data.stats);
      setRecentOrders(res.data.recentOrders);
    });
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="stat-grid">
        <div className="stat-card">
          <div className="icon"><i className="bi bi-bag"></i></div>
          <div className="number">{stats?.totalProducts ?? '-'}</div>
          <div className="text-muted">Products</div>
        </div>
        <div className="stat-card">
          <div className="icon"><i className="bi bi-receipt"></i></div>
          <div className="number">{stats?.totalOrders ?? '-'}</div>
          <div className="text-muted">Orders</div>
        </div>
        <div className="stat-card">
          <div className="icon"><i className="bi bi-hourglass-split"></i></div>
          <div className="number">{stats?.pendingOrders ?? '-'}</div>
          <div className="text-muted">Pending Orders</div>
        </div>
        <div className="stat-card">
          <div className="icon"><i className="bi bi-cash-stack"></i></div>
          <div className="number">{stats ? formatPrice(stats.revenue) : '-'}</div>
          <div className="text-muted">Revenue</div>
        </div>
      </div>

      <div className="admin-table-card">
        <h5 className="mb-3">Recent Orders</h5>
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o._id}>
                <td><Link to={`/admin/orders/${o._id}`}>#{o._id.slice(-8).toUpperCase()}</Link></td>
                <td>{o.customerName}</td>
                <td>{formatPrice(o.totalAmount)}</td>
                <td style={{ textTransform: 'capitalize' }}>{o.status}</td>
                <td>{formatDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
