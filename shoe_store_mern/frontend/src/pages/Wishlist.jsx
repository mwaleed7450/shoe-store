import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const { items } = useWishlist();

  return (
    <Layout>
      <div className="container py-5">
        <span className="eyebrow text-center" style={{ display: 'block', textAlign: 'center' }}>Saved for later</span>
        <h2 className="section-title">YOUR WISHLIST</h2>

        {items.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-heart"></i>
            <p>Nothing saved yet. Tap the heart on any shoe to keep it here.</p>
            <Link to="/shop" className="btn btn-accent">Browse Shoes</Link>
          </div>
        ) : (
          <div className="grid">
            {items.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
