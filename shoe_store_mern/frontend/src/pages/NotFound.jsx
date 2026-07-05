import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="empty-state" style={{ padding: '110px 20px' }}>
        <span className="eyebrow">Error 404</span>
        <h2 className="section-title" style={{ marginBottom: 0 }}>This page walked off somewhere</h2>
        <p>The page you're looking for doesn't exist or may have moved.</p>
        <Link to="/" className="btn btn-accent">Back to Home</Link>
      </div>
    </Layout>
  );
}
