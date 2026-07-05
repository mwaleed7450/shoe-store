import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminApi } from '../../api/axios';

export default function AdminChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      const res = await adminApi.post('/admin/auth/change-password', form);
      setStatus({ type: 'success', text: res.data.message });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus({ type: 'danger', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminLayout title="Change Password">
      <div className="admin-table-card" style={{ maxWidth: 450 }}>
        {status && <div className={`alert alert-${status.type}`}>{status.text}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input type="password" className="form-control" required value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-control" required minLength={6} value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input type="password" className="form-control" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-dark" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
