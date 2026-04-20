const express = require('express');
const Search = require('../models/Search');
const { generateFalUrl } = require('../utils/adsLibrary');
const router = express.Router();

// @route   POST api/searches
// @desc    Create FAL search
router.post('/', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query required' });

    const falUrl = generateFalUrl(query);
    
    const search = new Search({
      query,
      falUrl
    });

    await search.save();
    res.json({ 
      id: search._id,
      query,
      falUrl,
      message: 'Search saved. Open URL to view ads.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET api/searches
// @desc    Get search history
router.get('/', async (req, res) => {
  try {
    const searches = await Search.find().sort({ createdAt: -1 }).limit(50);
    res.json(searches);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

