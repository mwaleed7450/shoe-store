import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axios';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const { customer, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', paymentMethod: 'cod',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoggedIn && customer) {
      setForm((f) => ({
        ...f,
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
      }));
    }
  }, [isLoggedIn, customer]);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/orders', {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        paymentMethod: form.paymentMethod,
        items: items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
      });
      clearCart();
      navigate('/order-success', { state: { orderId: res.data.orderId } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong placing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="section-title">CHECKOUT</h2>

        <div className="checkout-grid">
          <div>
            <form onSubmit={handleSubmit} className="auth-card" style={{ margin: 0 }}>
              <h5 className="mb-3">Delivery Details</h5>
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-control" required value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="text" name="phone" className="form-control" required value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Email (optional)</label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <textarea name="address" className="form-control" rows="3" required value={form.address} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select name="paymentMethod" className="form-select" value={form.paymentMethod} onChange={handleChange}>
                  <option value="cod">Cash on Delivery</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div>
            <div className="auth-card" style={{ margin: 0 }}>
              <h5 className="mb-3">Order Summary</h5>
              {items.map((item) => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>{item.name} {item.size ? `(${item.size})` : ''} x {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.15rem' }}>
                <span>Total</span><span className="price-new">{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
