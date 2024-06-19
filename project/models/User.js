const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String, 
  email: String,
  password: String, // In a real-world app, ensure this is hashed
});

module.exports = mongoose.model('User', userSchema);