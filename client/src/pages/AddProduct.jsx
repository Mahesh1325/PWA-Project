import React, { useState } from 'react';
import { addProduct } from '../api';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProduct({ name, price, image });
    navigate('/products');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Price: </label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Image URL: </label>
          <input value={image} onChange={e => setImage(e.target.value)} />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}