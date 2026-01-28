import React, { useState, useEffect } from 'react';
import { getProducts, updateProduct } from '../api';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditProduct() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProducts();
      const prod = res.data.find(p => p._id === id);
      if (prod) {
        setName(prod.name);
        setPrice(prod.price);
        setImage(prod.image);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProduct(id, { name, price, image });
    navigate('/products');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Product</h2>
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
}