import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/newsletter', { email });
      showToast("You're subscribed!");
      setEmail('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="site-footer">
      <div className="newsletter-strip">
        <div className="container newsletter-inner">
          <div>
            <h4>Get first look at new drops</h4>
            <p>Occasional email. No spam, just new arrivals and sale alerts.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-accent" disabled={submitting}>
              {submitting ? '...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      <div className="container footer-grid">
        <div>
          <h5 className="brand-font" style={{ color: '#fff' }}>StepUp <span>Shoes</span></h5>
          <p className="footer-text">Quality footwear for men, women and kids — comfortable, durable, and made for everyday life.</p>
        </div>
        <div>
          <h6 style={{ color: '#fff', marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', letterSpacing: '1px' }}>CUSTOMER CARE</h6>
          <Link to="/contact" className="footer-link">Contact Us</Link>
          <Link to="/help" className="footer-link">Help / Support</Link>
          <Link to="/account" className="footer-link">Order Tracking</Link>
          <Link to="/wishlist" className="footer-link">Wishlist</Link>
        </div>
        <div>
          <h6 style={{ color: '#fff', marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', letterSpacing: '1px' }}>FOLLOW US</h6>
          <a href="https://facebook.com/yourpage" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '1.4rem', marginRight: 12 }}><i className="bi bi-facebook"></i></a>
          <a href="https://instagram.com/yourpage" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '1.4rem', marginRight: 12 }}><i className="bi bi-instagram"></i></a>
          <a href="https://youtube.com/@yourchannel" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '1.4rem' }}><i className="bi bi-youtube"></i></a>
        </div>
      </div>
      <p className="footer-bottom">&copy; {new Date().getFullYear()} StepUp Shoes. All rights reserved.</p>
    </footer>
  );
}
