import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/auth/login', form);
      navigate('/verify-otp', { state: { pendingCustomerId: res.data.pendingCustomerId } });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="auth-card">
        <h3 className="text-center mb-4 brand-font">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-3 mb-0">New here? <Link to="/register">Create an account</Link></p>
      </div>
    </Layout>
  );
}
