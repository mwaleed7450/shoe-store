import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/auth/register', form);
      navigate('/verify-otp', { state: { pendingCustomerId: res.data.pendingCustomerId } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="auth-card">
        <h3 className="text-center mb-4 brand-font">Create Account</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input type="text" className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
            {submitting ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-3 mb-0">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </Layout>
  );
}
