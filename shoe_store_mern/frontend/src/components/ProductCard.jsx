import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const hasDiscount = !!product.discountPrice;
  const placeholder = 'https://placehold.co/400x400?text=StepUp+Shoes';
  const liked = isWishlisted(product._id);

  function handleAdd() {
    addToCart(product, '', 1);
    showToast(`${product.name} added to cart`);
  }

  function handleWishlist(e) {
    e.preventDefault();
    const added = toggleWishlist(product);
    showToast(added ? 'Saved to wishlist' : 'Removed from wishlist');
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="img-wrap">
        {hasDiscount && <span className="badge-sale">SALE</span>}
        <img src={product.image || placeholder} alt={product.name} loading="lazy" />
      </Link>
      <button className={`wishlist-heart ${liked ? 'active' : ''}`} onClick={handleWishlist} aria-label="Toggle wishlist">
        <i className={liked ? 'bi bi-heart-fill' : 'bi bi-heart'}></i>
      </button>
      <div className="body">
        <Link to={`/product/${product._id}`} className="name">{product.name}</Link>
        <div className="price-tag">
          {hasDiscount ? (
            <>
              <span className="price-old">{formatPrice(product.price)}</span>
              <span className="price-new">{formatPrice(product.discountPrice)}</span>
            </>
          ) : (
            <span className="price-new">{formatPrice(product.price)}</span>
          )}
        </div>
        {product.stock > 0 ? (
          <button className="btn btn-dark btn-sm" style={{ width: '100%', marginTop: 'auto' }} onClick={handleAdd}>
            <i className="bi bi-bag-plus"></i> Add to Cart
          </button>
        ) : (
          <span className="out-of-stock">Out of stock</span>
        )}
      </div>
    </div>
  );
}
