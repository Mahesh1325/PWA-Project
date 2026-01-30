import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../api';
import { useNavigate } from 'react-router-dom';

export default function ManageProducts() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };

  const filtered = products.filter(p => (
    !query || String(p.name || '').toLowerCase().includes(query.toLowerCase()) ||
    String(p.brand || '').toLowerCase().includes(query.toLowerCase()) ||
    String(p.category || '').toLowerCase().includes(query.toLowerCase())
  ));

  return (
    <div className="container">
      <div className="page-header">
        <h2>Manage Products</h2>
        <div>
          <button onClick={() => navigate('/')}>Home</button>
        </div>
      </div>

      <div className="search-bar">
        <input className="search-input" placeholder="Search by name, brand or category" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button onClick={() => setQuery('')}>Clear</button>
      </div>

      {loading ? <div className="muted">Loading...</div> : (
        <div>
          {filtered.map(p => (
            <div key={p._id} className="card manage-row mb-10">
              <img className="thumb-small" src={p.image || 'https://via.placeholder.com/120x80?text=No+Image'} alt={p.name} onError={(e)=>{e.target.src='https://via.placeholder.com/120x80?text=No+Image'}} />
              <div className="flex-1">
                <div className="font-strong">{p.name}</div>
                <div className="muted">{p.brand} · {p.category}</div>
                <div className="muted">₹{p.price} · Stock: {p.stock ?? 0}</div>
              </div>
              <div className="actions">
                <button onClick={() => navigate(`/edit-product/${p._id}`)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(p._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
