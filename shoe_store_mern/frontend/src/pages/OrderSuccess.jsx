import { useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function OrderSuccess() {
  const { state } = useLocation();
  const orderId = state?.orderId;

  return (
    <Layout>
      <div className="container py-5 text-center" style={{ padding: '80px 20px' }}>
        <i className="bi bi-check-circle" style={{ fontSize: '4rem', color: '#256029' }}></i>
        <h2 className="section-title mt-3">Order Placed Successfully!</h2>
        {orderId && <p className="text-muted">Order reference: <strong>#{orderId.slice(-8).toUpperCase()}</strong></p>}
        <p className="text-muted">We'll contact you soon to confirm delivery details.</p>
        <Link to="/shop" className="btn btn-accent mt-3">Continue Shopping</Link>
      </div>
    </Layout>
  );
}
