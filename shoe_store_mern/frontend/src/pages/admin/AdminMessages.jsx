import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { formatDate } from '../../utils/format';
import { adminApi } from '../../api/axios';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/admin/messages').then((res) => setMessages(res.data.messages)).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Contact Messages">
      <div className="admin-table-card">
        {loading ? <p className="text-muted">Loading...</p> : (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Message</th><th>Date</th></tr></thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td style={{ maxWidth: 400 }}>{m.message}</td>
                  <td>{formatDate(m.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && messages.length === 0 && <p className="text-muted">No messages yet.</p>}
      </div>
    </AdminLayout>
  );
}
