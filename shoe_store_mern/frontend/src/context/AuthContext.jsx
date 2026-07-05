import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setCustomer(res.data.customer))
      .catch(() => localStorage.removeItem('customer_token'))
      .finally(() => setLoading(false));
  }, []);

  function loginSuccess(token, customerData) {
    localStorage.setItem('customer_token', token);
    setCustomer(customerData);
  }

  function logout() {
    localStorage.removeItem('customer_token');
    setCustomer(null);
  }

  return (
    <AuthContext.Provider value={{ customer, loading, loginSuccess, logout, isLoggedIn: !!customer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
