import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../api';
import { useNavigate } from 'react-router-dom';

export default function DeleteProduct() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure?');
    if (!confirm) return;

    await deleteProduct(id);
    loadProducts(); // refresh list
  };

  return (
    <div className="container">
      <h2>Delete Product</h2>

      <button onClick={() => navigate('/')}>Home</button>

      {products.map((p) => (
        <div key={p._id} className="mb-10">
          <b>{p.name}</b> - ₹{p.price}
          <button className="ml-10" onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}