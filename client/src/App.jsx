import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ViewProducts from './pages/ViewProducts';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ManageProducts from './pages/ManageProducts';
import Search from './pages/Search';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ViewProducts />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/manage" element={<ManageProducts />} />
        <Route path="/search" element={<Search />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
    
      </Routes>
    </Router>
  );
}