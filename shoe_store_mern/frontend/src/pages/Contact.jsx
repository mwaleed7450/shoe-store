import { useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api/axios';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // { type, text }
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      const res = await api.post('/contact', form);
      setStatus({ type: 'success', text: res.data.message });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'danger', text: err.response?.data?.message || 'Something went wrong.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="section-title">CONTACT US</h2>
        <div className="auth-card">
          {status && <div className={`alert alert-${status.type}`}>{status.text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows="5" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
