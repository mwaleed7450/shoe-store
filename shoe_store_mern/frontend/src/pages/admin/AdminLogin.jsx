import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginSuccess } = useAdminAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await adminApi.post('/admin/auth/login', form);
      loginSuccess(res.data.token, res.data.admin);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-box">
      <h3 className="text-center mb-4 brand-font">Admin Login</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-dark btn-block" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
