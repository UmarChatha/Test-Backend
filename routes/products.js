const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const Product = require('../models/Product');
 

router.get('/',auth,async (req, res) => {
  console.log('in')
  let allProducts = await Product.find();
  res.json(allProducts);
});
router.post('/', [
  auth,
  [
    check('name', 'Name is required').notEmpty(),
    check('price', 'Price must be a number').isNumeric(),
    check('quantity', 'Quantity must be a number').isNumeric(),
   ]
], async (req, res) => {

  console.log(req.body)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, price, quantity } = req.body;
  const pictures = req.files.map(file => file.path); // Get the file paths from req.files
  try {
    
    
    const newProduct = new Product({
      user: req.user.id,
      name,
      price,
      quantity,
      pictures
    });

    const product = await newProduct.save();

    let allProducts = await Product.find();
    res.json(allProducts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
