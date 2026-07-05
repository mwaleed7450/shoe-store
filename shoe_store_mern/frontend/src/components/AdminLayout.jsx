import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLayout({ title, children }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  const linkClass = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand"><i className="bi bi-shop"></i> StepUp Admin</div>
        <NavLink to="/admin/dashboard" className={linkClass}><i className="bi bi-speedometer2"></i> Dashboard</NavLink>
        <NavLink to="/admin/products" className={linkClass}><i className="bi bi-bag"></i> Products</NavLink>
        <NavLink to="/admin/customers" className={linkClass}><i className="bi bi-people"></i> Customers</NavLink>
        <NavLink to="/admin/categories" className={linkClass}><i className="bi bi-tags"></i> Categories</NavLink>
        <NavLink to="/admin/orders" className={linkClass}><i className="bi bi-receipt"></i> Orders</NavLink>
        <NavLink to="/admin/messages" className={linkClass}><i className="bi bi-envelope"></i> Messages</NavLink>
        <NavLink to="/admin/change-password" className={linkClass}><i className="bi bi-key"></i> Change Password</NavLink>
        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}><i className="bi bi-box-arrow-right"></i> Logout</a>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <h3 style={{ margin: 0 }}>{title}</h3>
          <span className="text-muted">Hi, {admin?.fullName || admin?.username}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
