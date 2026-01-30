import React, { useEffect, useState, useMemo } from 'react';
import { getProducts, deleteProduct } from '../api';
import { useNavigate } from 'react-router-dom';

const PLACEHOLDER = 'https://via.placeholder.com/800x600?text=No+Image';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null); // product for modal view
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this product?');
    if (!ok) return;
    try {
      await deleteProduct(id);
      await fetchProducts();
      if (selected && selected._id === id) setSelected(null);
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete');
    }
  };

  const filtered = useMemo(() => {
    if (!query) return products;
    return products.filter(p => (
      String(p.name || '').toLowerCase().includes(query.toLowerCase()) ||
  String(p.brand || '').toLowerCase().includes(query.toLowerCase()) ||
  String(p.category || '').toLowerCase().includes(query.toLowerCase())
    ));
  }, [products, query]);

  return (
    <div className="container">
      <div className="page-header">
        <h2>Products</h2>
        <div className="header-actions">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/manage')}>Manage</button>
        </div>
      </div>

      <div className="search-bar">
        <input className="search-input" placeholder="Search by name, brand or category" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button onClick={() => setQuery('')}>Clear</button>
      </div>

      {loading ? <div className="muted">Loading...</div> : (
        <div className="grid-cards">
          {filtered.map(p => (
            <div key={p._id} className="card card-pos">
              <div className="card-image clickable" onClick={() => setSelected(p)}>
                <img className="thumbnail" src={p.image || PLACEHOLDER} alt={p.name} onError={(e)=>{e.target.src=PLACEHOLDER}} />
              </div>

              <div className="card-body">
                <div>
                  <div className="card-title">{p.name}</div>
                  <div className="muted">{p.brand} · {p.category}</div>
                  <div className="card-desc">{(p.description || '').slice(0,160)}{(p.description||'').length>160?'...':''}</div>
                </div>

                <div className="text-right">
                  <div className="font-strong">₹{p.price}</div>
                  <div className="muted">Stock: {p.stock ?? 0}</div>
                </div>
              </div>

              {/* no inline manage actions here (Manage page handles edit/delete) */}
            </div>
          ))}
        </div>
      )}

      {/* Modal: selected product */}
      {selected && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div className="view-grid">
              <div className="view-image">
                <img src={selected.image || PLACEHOLDER} alt={selected.name} onError={(e)=>{e.target.src=PLACEHOLDER}} />
              </div>
              <div className="view-details">
                <h2>{selected.name}</h2>
                <div className="muted">{selected.brand} · {selected.category}</div>
                <div className="price-strong">₹{selected.price}</div>
                <div className="muted mt-8">Stock: {selected.stock ?? 0}</div>
                <div className="mt-12">{selected.description}</div>
                {selected.tags && selected.tags.length > 0 && <div className="muted mt-12">Tags: {selected.tags.join(', ')}</div>}

                <div className="actions mt-18">
                  <button onClick={() => navigate(`/edit-product/${selected._id}`)}>Edit</button>
                  <button className="danger" onClick={() => { handleDelete(selected._id); }}>Delete</button>
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