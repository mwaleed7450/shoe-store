import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { formatPrice, formatDate } from '../../utils/format';
import { adminApi } from '../../api/axios';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/admin/customers').then((res) => setCustomers(res.data.customers)).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Customers">
      <div className="admin-table-card">
        {loading ? <p className="text-muted">Loading...</p> : (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Verified</th><th>Orders</th><th>Total Spent</th><th>Joined</th></tr></thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || '-'}</td>
                  <td>
                    <span className={`badge ${c.isVerified ? 'badge-success' : 'badge-secondary'}`}>
                      {c.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td>{c.orderCount}</td>
                  <td>{formatPrice(c.totalSpent)}</td>
                  <td>{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && customers.length === 0 && <p className="text-muted">No customers have registered yet.</p>}
      </div>
    </AdminLayout>
  );
}
