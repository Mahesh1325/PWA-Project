import React, { useState } from 'react';
import { getProducts } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      const filtered = res.data.filter(p =>
        String(p.name || '').toLowerCase().includes(query.toLowerCase()) ||
        String(p.brand || '').toLowerCase().includes(query.toLowerCase()) ||
        String(p.category || '').toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2 className="page-title">Search Products</h2>
        <div>
          <button onClick={() => navigate('/')}>Home</button>
        </div>
      </div>

      <div className="search-bar">
        <input className="search-input" placeholder="Enter product name, brand or category" value={query} onChange={(e)=>setQuery(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => { setQuery(''); setResults([]);} }>Clear</button>
      </div>

      {loading ? <div className="muted">Searching...</div> : (
        <div className="mt-12">
          {results.map(p => (
            <div key={p._id} className="card card-row mb-10">
              <img className="thumb-small" src={p.image || 'https://via.placeholder.com/120x80?text=No+Image'} alt={p.name} onError={(e)=>{e.target.src='https://via.placeholder.com/120x80?text=No+Image'}} />
              <div className="flex-1">
                <div className="font-strong">{p.name}</div>
                <div className="muted">{p.brand} · {p.category}</div>
              </div>
              <div>
                <button onClick={() => navigate(`/products/${p._id}`)}>View</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}