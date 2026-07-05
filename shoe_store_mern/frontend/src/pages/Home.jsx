import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { api } from '../api/axios';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/categories'), api.get('/products/featured')])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data.categories);
        setProducts(prodRes.data.products);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="eyebrow" style={{ color: 'var(--brass-light)' }}>Est. StepUp Shoes</span>
            <h1>Step into <em>comfort</em><br />made for every walk.</h1>
            <p className="mt-3">Discover men's, women's and kids' shoes built for everyday life — comfortable, durable, and always in style.</p>
            <Link to="/shop" className="btn btn-accent mt-3">Shop Now</Link>
          </div>
          <div className="hero-tag">
            <div className="row"><span>Free Delivery</span><b>Rs. 5000+</b></div>
            <div className="row"><span>Easy Returns</span><b>7 Days</b></div>
            <div className="row"><span>Cash on Delivery</span><b>Available</b></div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <span className="eyebrow text-center" style={{ display: 'block', textAlign: 'center' }}>Find your fit</span>
          <h2 className="section-title">Shop by Category</h2>
          <div className="category-pills">
            <Link to="/shop" className="category-pill active">All</Link>
            {categories.map((cat) => (
              <Link key={cat._id} to={`/shop?category=${cat._id}`} className="category-pill">{cat.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          <span className="eyebrow text-center" style={{ display: 'block', textAlign: 'center' }}>Just landed</span>
          <h2 className="section-title">New Arrivals</h2>
          {!loading && products.length === 0 && (
            <p className="text-center text-muted">No products yet. Add some from the admin panel!</p>
          )}
          <div className="grid">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>

          <div className="trust-strip">
            <div className="trust-item"><i className="bi bi-truck"></i> Free delivery on orders Rs. 5000+</div>
            <div className="trust-item"><i className="bi bi-arrow-return-left"></i> 7-day easy returns</div>
            <div className="trust-item"><i className="bi bi-cash-stack"></i> Cash on delivery</div>
            <div className="trust-item"><i className="bi bi-shield-check"></i> Quality guaranteed</div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
