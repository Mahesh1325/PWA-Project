
import React, { useEffect, useState } from 'react';
import { getProductById, updateProduct } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProductById(id);
        const p = res.data;
        setForm({
          name: p.name || '',
          description: p.description || '',
          brand: p.brand || '',
          category: p.category || '',
          price: p.price || '',
          stock: p.stock || 0,
          image: p.image || '',
          tags: (p.tags || []).join(', ')
        });
      } catch (err) {
        // If product doesn't exist, redirect back to products list
        console.warn('Failed to load product for edit, redirecting', err);
        navigate('/products');
      }
    };

    loadProduct();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProduct(id, {
        name: form.name,
        description: form.description,
        brand: form.brand,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        image: form.image,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : []
      });
      setMessage('Product updated');
      setTimeout(() => navigate('/products'), 700);
    } catch (err) {
      setMessage('Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container">
      <h2>Edit Product</h2>

      <div className="form-card">
        <form className="form-row" onSubmit={handleSubmit}>
          <div className="field">
            <label>Name</label>
            <input name="name" value={form.name} onChange={onChange} required />
          </div>

          <div className="field">
            <label>Price</label>
            <input name="price" type="number" value={form.price} onChange={onChange} required />
          </div>

          <div className="field">
            <label>Brand</label>
            <input name="brand" value={form.brand} onChange={onChange} />
          </div>

          <div className="field">
            <label>Category</label>
            <input name="category" value={form.category} onChange={onChange} />
          </div>

          <div className="field">
            <label>Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={onChange} />
          </div>

          <div className="field full-width">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={4} />
          </div>

          <div className="field">
            <label>Image URL</label>
            <input name="image" value={form.image} onChange={onChange} />
          </div>

          <div className="field">
            <label>Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={onChange} />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/products')} disabled={loading}>Cancel</button>
            <button type="submit" disabled={loading} className="ml-8">{loading ? 'Saving...' : 'Update'}</button>
          </div>
        </form>

  {message && <div className="message muted">{message}</div>}
      </div>
    </div>
  );
}