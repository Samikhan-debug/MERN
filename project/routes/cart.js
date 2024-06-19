const express = require('express');
const router = express.Router();

// Get the cart
router.get('/', (req, res) => {
    res.json(req.session.cart || {});
});

// Add a product to the cart
router.post('/add', (req, res) => {
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity, 10);

    if (!req.session.cart) {
        req.session.cart = {};
    }

    if (req.session.cart[productId]) {
        req.session.cart[productId] += quantity;
    } else {
        req.session.cart[productId] = quantity;
    }

    res.json({ success: true, cart: req.session.cart });
});

module.exports = router;
