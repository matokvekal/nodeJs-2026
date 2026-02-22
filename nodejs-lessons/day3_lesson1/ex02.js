// models/User.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name must be at most 50 characters']
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  
  age: {
    type: Number,
    min: [18, 'Must be at least 18 years old'],
    max: [120, 'Age must be less than 120']
  },
  
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'moderator'],
      message: '{VALUE} is not a valid role'
    },
    default: 'user'
  },
  
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number`
    }
  },
  
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false  // Don't return password by default in queries
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  tags: {
    type: [String],
    validate: [arr => arr.length <= 10, 'Maximum 10 tags allowed']
  },
  
  metadata: {
    type: Map,
    of: String,
    default: {}
  }
  
}, { 
  timestamps: true,  // Adds createdAt & updatedAt automatically
  collection: 'users'
});

// Indexes for query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model('User', userSchema);