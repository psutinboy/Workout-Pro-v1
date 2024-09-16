const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  email: { type: String, required: true, unique: true }
});

// Pre-save hook to hash password and convert username to lowercase
userSchema.pre('save', async function(next) {
  try {
    // Convert username to lowercase
    this.username = this.username.toLowerCase();

    // Hash password if it is modified
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log("Candidate password:", candidatePassword);
  console.log("Stored hashed password:", this.password);
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  console.log("Password comparison result:", isMatch);
  return isMatch;
};

const User = mongoose.model('User', userSchema);

module.exports = User;