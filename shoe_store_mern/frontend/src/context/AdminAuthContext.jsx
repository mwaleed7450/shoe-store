import { createContext, useContext, useEffect, useState } from 'react';
import { adminApi } from '../api/axios';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    adminApi
      .get('/admin/auth/me')
      .then((res) => setAdmin(res.data.admin))
      .catch(() => localStorage.removeItem('admin_token'))
      .finally(() => setLoading(false));
  }, []);

  function loginSuccess(token, adminData) {
    localStorage.setItem('admin_token', token);
    setAdmin(adminData);
  }

  function logout() {
    localStorage.removeItem('admin_token');
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, loginSuccess, logout, isLoggedIn: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
