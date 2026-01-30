const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Helper: basic server-side validation for important fields
function validateProductBody(body) {
  const errors = [];
  if (!body.name || String(body.name).trim() === '') errors.push('name is required');
  if (body.price === undefined || body.price === '' || isNaN(Number(body.price))) errors.push('price is required and must be a number');
  if (body.price < 0) errors.push('price must be >= 0');
  return errors;
}

// CREATE
router.post('/', async (req, res) => {
  try {
    const errs = validateProductBody(req.body);
    if (errs.length) return res.status(400).json({ errors: errs });

    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// READ BY ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid product ID' });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const errs = validateProductBody(req.body);
    if (errs.length) return res.status(400).json({ errors: errs });

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(400).json({ error: 'Failed to update product' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(400).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;