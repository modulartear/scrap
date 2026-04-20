const express = require('express');
const Product = require('../models/Product');
const { scrapeProduct } = require('../scrapers/productScraper');
const router = express.Router();

// @route   POST api/products/scrape
// @desc    Scrape product from URL
router.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });

    // Check if already scraped
    let product = await Product.findOne({ url });
    if (product) {
      return res.json(product);
    }

    // Scrape
    const data = await scrapeProduct(url);
    if (!data) return res.status(400).json({ error: 'Scraping failed' });

    product = new Product({
      url,
      store: data.store || 'Unknown',
      title: data.title,
      price: data.price,
      description: data.description,
      images: data.images
    });

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET api/products
// @desc    Get products with filters
router.get('/', async (req, res) => {
  try {
    const { keyword, minPrice, maxPrice, favorite } = req.query;
    let query = {};

    if (keyword) query.title = { $regex: keyword, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (favorite === 'true') query.isFavorite = true;

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST api/products/:id/favorite
// @desc    Toggle favorite
router.post('/:id/favorite', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });

    product.isFavorite = !product.isFavorite;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

