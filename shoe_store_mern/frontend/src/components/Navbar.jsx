import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const { cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  return (
    <>
      <nav className="site-navbar">
        <div className="container nav-inner">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <i className="bi bi-list"></i>
          </button>

          <Link to="/" className="navbar-brand brand-font">
            StepUp <span>Shoes</span>
          </Link>

          <ul className="nav-links">
            <li><Link to="/shop">New In</Link></li>
            <li><Link to="/shop?category=men">Men</Link></li>
            <li><Link to="/shop?category=women">Women</Link></li>
            <li><Link to="/shop?category=kids">Kids</Link></li>
            <li><Link to="/shop?category=sale" className="sale-link">Sale</Link></li>
          </ul>

          <div className="nav-icons">
            <Link to="/shop"><i className="bi bi-search"></i></Link>
            <Link to="/wishlist" style={{ position: 'relative' }}>
              <i className="bi bi-heart"></i>
              {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
            </Link>
            <Link to={isLoggedIn ? '/account' : '/login'}><i className="bi bi-person"></i></Link>
            <Link to="/cart" style={{ position: 'relative' }}>
              <i className="bi bi-bag"></i>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <>
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
          <div className="sidebar-drawer">
            <button className="close-btn" onClick={() => setSidebarOpen(false)}>&times;</button>
            <h5 className="brand-font mb-3">StepUp <span>Shoes</span></h5>
            <Link to="/" className="sidebar-link" onClick={() => setSidebarOpen(false)}><i className="bi bi-house-door"></i> Home</Link>
            <Link to="/shop" className="sidebar-link" onClick={() => setSidebarOpen(false)}><i className="bi bi-grid"></i> Shop All</Link>
            <Link to="/wishlist" className="sidebar-link" onClick={() => setSidebarOpen(false)}><i className="bi bi-heart"></i> Wishlist</Link>
            <Link to="/contact" className="sidebar-link" onClick={() => setSidebarOpen(false)}><i className="bi bi-envelope"></i> Contact</Link>
            <Link to="/help" className="sidebar-link" onClick={() => setSidebarOpen(false)}><i className="bi bi-question-circle"></i> Help / Support</Link>
            <hr />
            {isLoggedIn ? (
              <>
                <Link to="/account" className="sidebar-link" onClick={() => setSidebarOpen(false)}><i className="bi bi-person"></i> My Account</Link>
                <button
                  className="sidebar-link"
                  style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                  onClick={() => { logout(); setSidebarOpen(false); }}
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="sidebar-link" onClick={() => setSidebarOpen(false)}><i className="bi bi-box-arrow-in-right"></i> Login</Link>
                <Link to="/register" className="sidebar-link" onClick={() => setSidebarOpen(false)}><i className="bi bi-person-plus"></i> Register / Sign Up</Link>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
