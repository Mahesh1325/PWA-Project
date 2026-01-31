import React, { useEffect, useState, useMemo } from 'react';
import { getProducts, deleteProduct } from '../api';
import { useNavigate } from 'react-router-dom';

const PLACEHOLDER = 'https://thumbs.dreamstime.com/b/print-305124519.jpg';

export default function ViewProducts() {
  const [products, setProducts] = useState([]);     // ALWAYS an array
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  /* =======================
     FETCH PRODUCTS (SAFE)
  ======================= */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();

      // Normalize axios / fetch / cached responses
      let payload = res;
      if (res && typeof res.data !== 'undefined') payload = res.data;

      // Handle SW offline fallback or error JSON
      if (payload && payload.error) {
        console.warn('API error:', payload.error);
        setProducts([]);
        return;
      }

      let list = [];

      if (Array.isArray(payload)) {
        list = payload;
      } else if (payload && Array.isArray(payload.products)) {
        list = payload.products;
      } else if (payload && Array.isArray(payload.data)) {
        list = payload.data;
      } else {
        list = [];
      }

      // GUARANTEE ARRAY
      setProducts(Array.isArray(list) ? list : []);
      setError('');
    } catch (err) {
        // 👇 THIS IS WHERE IT GOES
        setError('You are offline. Showing last saved products.');
         setProducts([]);
    } //catch (err) {
      //console.error('Failed to load products', err);
      //setProducts([]); // never let products be non-array
   // } 
   finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =======================
     DELETE PRODUCT
  ======================= */
  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this product?');
    if (!ok) return;

    try {
      await deleteProduct(id);
      await fetchProducts();
      if (selected && (selected._id === id || selected.id === id)) {
        setSelected(null);
      }
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete product');
    }
  };

  /* =======================
     FILTERED PRODUCTS
  ======================= */
  const filtered = useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (!query) return products;

    const q = query.toLowerCase();
    return products.filter((p) =>
      String(p.name || '').toLowerCase().includes(q) ||
      String(p.brand || '').toLowerCase().includes(q) ||
      String(p.category || '').toLowerCase().includes(q)
    );
  }, [products, query]);

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="container">
      <div className="page-header">
        <h2>Products</h2>
        <div className="header-actions">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/manage')}>Manage</button>
        </div>
      </div>
    {error && <div className="warning">{error}</div>}
      <div className="search-bar">
        <input
          className="search-input"
          placeholder="Search by name, brand or category"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={() => setQuery('')}>Clear</button>
      </div>

      {loading ? (
        <div className="muted">Loading...</div>
      ) : (
        <div className="grid-cards">
          {filtered.length === 0 ? (
            <div className="muted">No products</div>
          ) : (
            filtered.map((p) => (
              <div key={p._id ?? p.id} className="card card-pos">
                <div
                  className="card-image clickable"
                  onClick={() => setSelected(p)}
                >
                  <img
                    className="thumbnail"
                    src={p.image || PLACEHOLDER}
                    alt={p.name}
                    onError={(e) => {
                      e.target.src = PLACEHOLDER;
                    }}
                  />
                </div>

                <div className="card-body">
                  <div>
                    <div className="card-title">{p.name}</div>
                    <div className="muted">
                      {p.brand} · {p.category}
                    </div>
                    <div className="card-desc">
                      {(p.description || '').slice(0, 160)}
                      {(p.description || '').length > 160 ? '...' : ''}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-strong">₹{p.price}</div>
                    <div className="muted">Stock: {p.stock ?? 0}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* =======================
         MODAL VIEW
      ======================= */}
      {selected && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div className="view-grid">
              <div className="view-image">
                <img
                  src={PLACEHOLDER}
                  alt={selected.name}
                  onError={(e) => {
                    e.target.src = PLACEHOLDER;
                  }}
                />
              </div>

              <div className="view-details">
                <h2>{selected.name}</h2>
                <div className="muted">
                  {selected.brand} · {selected.category}
                </div>
                <div className="price-strong">₹{selected.price}</div>
                <div className="muted mt-8">
                  Stock: {selected.stock ?? 0}
                </div>
                <div className="mt-12">{selected.description}</div>

                {selected.tags?.length > 0 && (
                  <div className="muted mt-12">
                    Tags: {selected.tags.join(', ')}
                  </div>
                )}

                <div className="actions mt-18">
                  <button
                    onClick={() =>
                      navigate(`/edit-product/${selected._id ?? selected.id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="danger"
                    onClick={() =>
                      handleDelete(selected._id ?? selected.id)
                    }
                  >
                    Delete
                  </button>
                  <button onClick={() => setSelected(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
