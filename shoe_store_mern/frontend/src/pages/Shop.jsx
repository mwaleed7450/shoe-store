import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { api } from '../api/axios';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState('newest');

  const categoryId = searchParams.get('category') || '';
  const search = searchParams.get('q') || '';

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (categoryId) params.category = categoryId;
    if (search) params.q = search;
    api
      .get('/products', { params })
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));
  }, [categoryId, search]);

  const sortedProducts = useMemo(() => {
    const list = [...products];
    const effectivePrice = (p) => p.discountPrice || p.price;
    if (sort === 'price_low') list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    else if (sort === 'price_high') list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    // 'newest' relies on the API's default sort (createdAt desc)
    return list;
  }, [products, sort]);

  function handleSearch(e) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput) next.set('q', searchInput);
    else next.delete('q');
    setSearchParams(next);
  }

  return (
    <Layout>
      <div className="container py-5">
        <span className="eyebrow text-center" style={{ display: 'block', textAlign: 'center' }}>Full collection</span>
        <h2 className="section-title">Shop All Shoes</h2>

        <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', maxWidth: 420, width: '100%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search shoes..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ borderRadius: '4px 0 0 4px' }}
            />
            <button className="btn btn-dark" type="submit" style={{ borderRadius: '0 4px 4px 0' }}>
              <i className="bi bi-search"></i>
            </button>
          </div>
        </form>

        <div className="category-pills">
          <Link to="/shop" className={`category-pill ${!categoryId ? 'active' : ''}`}>All</Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat._id}`}
              className={`category-pill ${categoryId === cat._id ? 'active' : ''}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="toolbar">
          <span className="result-count">{loading ? 'Loading...' : `${sortedProducts.length} result${sortedProducts.length !== 1 ? 's' : ''}`}</span>
          <select className="form-select" style={{ maxWidth: 200 }} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>

        {!loading && sortedProducts.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-search"></i>
            <p>No products found. Try a different search or category.</p>
          </div>
        )}

        <div className="grid">
          {sortedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </Layout>
  );
}
