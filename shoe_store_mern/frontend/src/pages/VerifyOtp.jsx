import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!state?.pendingCustomerId) return <Navigate to="/login" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/auth/verify-otp', { pendingCustomerId: state.pendingCustomerId, otp });
      loginSuccess(res.data.token, res.data.customer);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError('');
    setInfo('');
    try {
      await api.post('/auth/resend-otp', { pendingCustomerId: state.pendingCustomerId });
      setInfo('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  }

  return (
    <Layout>
      <div className="auth-card">
        <h3 className="text-center mb-4 brand-font">Verify Your Email</h3>
        <p className="text-muted text-center">Enter the 6-digit code we sent to your email.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        {info && <div className="alert alert-success">{info}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">OTP Code</label>
            <input
              type="text"
              maxLength="6"
              className="form-control"
              style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '6px' }}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
            {submitting ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <p className="text-center mt-3 mb-0">
          Didn't get a code? <button onClick={handleResend} style={{ border: 'none', background: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>Resend OTP</button>
        </p>
      </div>
    </Layout>
  );
}
