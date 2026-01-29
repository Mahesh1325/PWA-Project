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
    <div style={{ padding: 20 }}>
      <h2>Delete Product</h2>

      <button onClick={() => navigate('/')}>Home</button>

      {products.map((p) => (
        <div key={p._id} style={{ margin: '10px 0' }}>
          <b>{p.name}</b> - ₹{p.price}
          <button
            onClick={() => handleDelete(p._id)}
            style={{ marginLeft: 10 }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}