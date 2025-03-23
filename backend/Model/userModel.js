const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  googleId: {
    type: String
  }
},{timestamp: true});

// Mail Validation
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
//   Password Validation
  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

// Signup method
userSchema.statics.signup = async function(username, email, password) {
  if (!email || !password || !username) {
    throw Error('All fields must be filled');
  }

  if (!validateEmail(email)) {
    throw Error('Invalid email format');
  }

  if (!validatePassword(password)) {
    throw Error('Password must be at least 8 characters with an uppercase letter, number, and special character');
  }
  
  const exists = await this.findOne({ $or: [{ email }, { username }] });
  if (exists) {
    throw Error('Email or username already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, username });
  return user;
};

// Login method
userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);