const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')  // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

router.post("/", upload.single('image'), async (req, res) => {
    const imageUrl = req.file ? path.join('images', req.file.filename) : null;
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        imageUrl: imageUrl
    });

    try {
        const savedProduct = await product.save();
        res.status(201).send(savedProduct);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/", async (req, res) => {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
        query = { name: { $regex: search, $options: 'i' } }; // Case insensitive searching by name
    }

    try {
        const total = await Product.countDocuments(query);
        const products = await Product.find(query).skip(skip).limit(limit);

        res.json({
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

// GET: Retrieve a single product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("Product not found");
        res.send(product);
    } catch (err) {
        res.status(500).send(err);
    }
});

// PUT: Update a product
router.put("/:id", upload.single('image'), async (req, res) => {
    const { name, price, description, category } = req.body;
    const imageUrl = req.file ? path.join('images', req.file.filename) : undefined;

    try {
        const updateData = { name, price, description, category };
        if (imageUrl) updateData.imageUrl = imageUrl; // Only update imageUrl if a new image is uploaded

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).send("Product not found");
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).send(err);
    }
});

// DELETE: Delete a product
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).send("Product not found");
        res.send(product);
    } catch (err) {
        res.status(500).send(err);
    }
});




module.exports = router;