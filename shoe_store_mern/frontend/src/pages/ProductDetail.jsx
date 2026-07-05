import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import { formatPrice } from '../utils/format';
import { api } from '../api/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const placeholder = 'https://placehold.co/500x500?text=StepUp+Shoes';

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data.product);
        setRelated(res.data.related);
        const sizes = res.data.product.sizes ? res.data.product.sizes.split(',') : [];
        if (sizes.length) setSize(sizes[0].trim());
      })
      .catch(() => navigate('/shop'));
  }, [id]);

  if (!product) return null;

  const sizes = product.sizes ? product.sizes.split(',').map((s) => s.trim()) : [];
  const liked = isWishlisted(product._id);

  function handleAdd() {
    addToCart(product, size, qty);
    showToast(`${product.name} added to cart`);
  }

  function handleWishlist() {
    const added = toggleWishlist(product);
    showToast(added ? 'Saved to wishlist' : 'Removed from wishlist');
  }

  return (
    <Layout>
      <div className="container py-5">
        <Breadcrumb items={[{ label: 'Shop', to: '/shop' }, { label: product.name }]} />

        <div className="product-detail-grid">
          <div>
            <div className="img-wrap" style={{ borderRadius: 6, border: '1px solid var(--sand-line)' }}>
              <img src={product.image || placeholder} alt={product.name} style={{ width: '100%', borderRadius: 6 }} />
            </div>
          </div>
          <div>
            <h2 className="brand-font">{product.name}</h2>
            <div className="price-tag mt-3" style={{ fontSize: '1.05rem', padding: '8px 14px' }}>
              {product.discountPrice ? (
                <>
                  <span className="price-old">{formatPrice(product.price)}</span>
                  <span className="price-new" style={{ fontSize: '1.3rem' }}>{formatPrice(product.discountPrice)}</span>
                </>
              ) : (
                <span className="price-new" style={{ fontSize: '1.3rem' }}>{formatPrice(product.price)}</span>
              )}
            </div>
            <p className="text-muted mt-2">{product.description}</p>

            {sizes.length > 0 && (
              <div className="mb-3 mt-3">
                <label className="form-label">Select Size</label>
                <select className="form-select" style={{ maxWidth: 150 }} value={size} onChange={(e) => setSize(e.target.value)}>
                  {sizes.map((s) => <option key={s} value={s}>EU {s}</option>)}
                </select>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <div className="qty-selector">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">&minus;</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase quantity">+</button>
              </div>
            </div>

            {product.stock > 0 ? (
              <>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button className="btn btn-accent btn-lg" onClick={handleAdd}>
                    <i className="bi bi-bag-plus"></i> Add to Cart
                  </button>
                  <button
                    className="btn btn-outline btn-lg"
                    style={{ padding: '16px 18px' }}
                    onClick={handleWishlist}
                    aria-label="Toggle wishlist"
                  >
                    <i className={liked ? 'bi bi-heart-fill' : 'bi bi-heart'} style={{ color: liked ? 'var(--leather)' : undefined }}></i>
                  </button>
                </div>
                <p className="mt-2" style={{ color: 'var(--sage)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <i className="bi bi-check-circle"></i> In stock &middot; {product.stock} available
                </p>
              </>
            ) : (
              <p className="out-of-stock" style={{ fontSize: '1rem' }}>Currently out of stock</p>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <>
            <span className="eyebrow text-center mt-4" style={{ display: 'block', textAlign: 'center', marginTop: 60 }}>Pairs well with</span>
            <h3 className="section-title">You May Also Like</h3>
            <div className="grid">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
