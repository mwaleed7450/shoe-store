import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderView from './pages/admin/AdminOrderView';
import AdminMessages from './pages/admin/AdminMessages';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminChangePassword from './pages/admin/AdminChangePassword';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AdminAuthProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Routes>
                  {/* Customer site */}
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-otp" element={<VerifyOtp />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

                  {/* Admin panel */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
                  <Route path="/admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
                  <Route path="/admin/products/new" element={<AdminProtectedRoute><AdminProductForm /></AdminProtectedRoute>} />
                  <Route path="/admin/products/:id/edit" element={<AdminProtectedRoute><AdminProductForm /></AdminProtectedRoute>} />
                  <Route path="/admin/categories" element={<AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>} />
                  <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
                  <Route path="/admin/orders/:id" element={<AdminProtectedRoute><AdminOrderView /></AdminProtectedRoute>} />
                  <Route path="/admin/messages" element={<AdminProtectedRoute><AdminMessages /></AdminProtectedRoute>} />
                  <Route path="/admin/customers" element={<AdminProtectedRoute><AdminCustomers /></AdminProtectedRoute>} />
                  <Route path="/admin/change-password" element={<AdminProtectedRoute><AdminChangePassword /></AdminProtectedRoute>} />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </AdminAuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
