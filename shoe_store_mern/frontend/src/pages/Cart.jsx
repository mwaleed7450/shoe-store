import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, cartTotal, updateQuantity, removeFromCart } = useCart();
  const placeholder = 'https://placehold.co/100x100?text=Shoe';

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="section-title">YOUR CART</h2>

        {items.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-bag-x"></i>
            <p>Your cart is empty.</p>
            <Link to="/shop" className="btn btn-accent">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="cart-table">
                <thead>
                  <tr><th>Product</th><th>Size</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.key}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={item.image || placeholder} className="cart-item-img" alt={item.name} />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td>{item.size || '-'}</td>
                      <td>{formatPrice(item.price)}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          className="form-control qty-box"
                          onChange={(e) => updateQuantity(item.key, Number(e.target.value) || 1)}
                        />
                      </td>
                      <td>{formatPrice(item.price * item.quantity)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.key)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24, marginTop: 24 }}>
              <h4>Total: <span className="price-new">{formatPrice(cartTotal)}</span></h4>
              <Link to="/checkout" className="btn btn-accent btn-lg">Proceed to Checkout</Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
