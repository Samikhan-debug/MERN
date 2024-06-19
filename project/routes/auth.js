const express = require('express');
const User = require('../models/User'); // Adjust the path as necessary
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Registration Handler
router.post('/register', async (req, res) => {
    const { email, username, password, confirm_password } = req.body;
    if (password !== confirm_password) {
        return res.render('registerpage', {
            error: "Passwords do not match."
        });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.render('registerpage', {
            error: "Username already exists."
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();
    req.session.user = newUser;
    res.redirect('/');
});

// Login Handler
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.render('loginpage', {
            error: "Invalid username or password."
        });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.render('loginpage', {
            error: "Invalid username or password."
        });
    }

    req.session.user = user;
    res.redirect('/');
});

// Logout Handler

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error logging out", err);
            return res.status(500).send("Error logging out");
        }
        res.redirect('/login');
    });
});

module.exports = router;
