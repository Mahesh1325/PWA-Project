import React, { useState } from 'react';
import { addProduct } from '../api';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
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
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || form.price === '') {
      setMessageType('error');
      return setMessage('Name and price are required');
    }
    setLoading(true);
    setMessage('');
    setMessageType('');
    try {
      const payload = {
        name: form.name,
        description: form.description,
        brand: form.brand,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        image: form.image,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : []
      };

      await addProduct(payload);
      setMessageType('success');
      setMessage('Product added successfully');
      setTimeout(() => navigate('/products'), 700);
    } catch (err) {
      // Server may return { errors: [...] } or { error: '...' }
      const serverErrors = err?.response?.data?.errors;
      if (Array.isArray(serverErrors)) {
        setMessage(serverErrors.join(', '));
      } else {
        setMessage(err?.response?.data?.error || err?.response?.data?.message || 'Failed to add product');
      }
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Add Product</h2>

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
            <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Product'}</button>
          </div>
        </form>

        {message && (
          <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'}`} role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}