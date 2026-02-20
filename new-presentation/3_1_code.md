# Day 3 - Presentation 1: MongoDB + Mongoose v7 - Code Examples

---

## Example 1: Mongoose Connection

```javascript
// db/mongoose.js
import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pool settings
      maxPoolSize: 100,  // Max concurrent connections
      minPoolSize: 10,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ MongoDB connected:', mongoose.connection.host);
    
    // Event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
export async function disconnectDB() {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
}

// Usage in server.js
// import { connectDB, disconnectDB } from './db/mongoose.js';
// await connectDB();
// process.on('SIGTERM', disconnectDB);
```

```bash
# Run MongoDB with Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Connection string examples
# Local: mongodb://localhost:27017/mydb
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net/mydb?retryWrites=true&w=majority
```

---

## Example 2: Schema with Validation

```javascript
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
```

---

## Example 3: Embedding vs Referencing

```javascript
// ===================================
// EMBEDDING - Data stored within document
// ===================================
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  
  // Embedded subdocument
  address: {
    street: String,
    city: String,
    country: String,
    zipCode: String
  },
  
  // Array of embedded documents
  socialProfiles: [{
    platform: String,
    url: String,
    verified: Boolean
  }]
});

const User = mongoose.model('User', userSchema);

// Usage: One query to get everything
const user = await User.findById(userId);
console.log(user.address.city);  // Direct access
console.log(user.socialProfiles[0].platform);

// When to use: Data always queried together, limited size

// ===================================
// REFERENCING - Data in separate collections
// ===================================
const authorSchema = new mongoose.Schema({
  name: String,
  email: String
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  
  // Reference to Author document
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  
  // Array of references
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }]
}, { timestamps: true });

const Author = mongoose.model('Author', authorSchema);
const Post = mongoose.model('Post', postSchema);

// Usage: Separate queries OR populate
const post = await Post.findById(postId).populate('author', 'name email');
console.log(post.author.name);  // Populated from Author collection

// When to use: Large data, independent queries, many-to-many relationships
```

---

## Example 4: CRUD Operations

```javascript
import { User } from './models/User.model.js';

// ===================================
// CREATE
// ===================================
// Single document
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 25,
  role: 'user'
});

// Alternative: new + save
const user2 = new User({ name: 'Jane', email: 'jane@example.com' });
await user2.save();

// Bulk create
const users = await User.insertMany([
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' }
]);

// ===================================
// READ
// ===================================
// Find all
const allUsers = await User.find();

// Find with filter
const admins = await User.find({ role: 'admin' });

// Find one
const user = await User.findOne({ email: 'john@example.com' });

// Find by ID
const userById = await User.findById('507f1f77bcf86cd799439011');

// Select specific fields
const names = await User.find().select('name email -_id');

// Sort
const sorted = await User.find().sort({ createdAt: -1 });  // Descending

// Limit & Skip (pagination)
const page1 = await User.find().limit(10).skip(0);
const page2 = await User.find().limit(10).skip(10);

// Count
const count = await User.countDocuments({ role: 'user' });

// ===================================
// UPDATE
// ===================================
// Find and update (returns old document by default)
const updated = await User.findByIdAndUpdate(
  userId,
  { name: 'Updated Name' },
  { new: true }  // Return updated document
);

// Update with validation
const validated = await User.findByIdAndUpdate(
  userId,
  { email: 'newemail@example.com' },
  { new: true, runValidators: true }  // Run schema validators
);

// Update many
const result = await User.updateMany(
  { isActive: false },
  { $set: { role: 'inactive' } }
);
console.log(`Modified ${result.modifiedCount} documents`);

// Instance update
const user = await User.findById(userId);
user.name = 'New Name';
await user.save();  // Triggers validation & middleware

// ===================================
// DELETE
// ===================================
// Delete one
await User.findByIdAndDelete(userId);

// Delete many
const deleteResult = await User.deleteMany({ isActive: false });
console.log(`Deleted ${deleteResult.deletedCount} users`);
```

---

## Example 5: Query Operators

```javascript
// Comparison operators
const adults = await User.find({ age: { $gte: 18 } });  // >= 18
const range = await User.find({ age: { $gte: 18, $lte: 65 } });  // 18-65
const notAdmin = await User.find({ role: { $ne: 'admin' } });  // Not equal
const specific = await User.find({ role: { $in: ['admin', 'moderator'] } });  // In array
const others = await User.find({ role: { $nin: ['admin', 'banned'] } });  // Not in array

// Logical operators
const query1 = await User.find({
  $or: [
    { role: 'admin' },
    { age: { $gte: 60 } }
  ]
});

const query2 = await User.find({
  $and: [
    { isActive: true },
    { role: 'user' }
  ]
});

// Element operators
const hasPhone = await User.find({ phone: { $exists: true } });
const stringEmails = await User.find({ email: { $type: 'string' } });

// Array operators
const withTags = await User.find({ tags: { $size: 3 } });  // Exactly 3 tags
const hasNodeTag = await User.find({ tags: 'nodejs' });  // Contains 'nodejs'
const hasAll = await User.find({ tags: { $all: ['nodejs', 'mongodb'] } });  // Has both

// String matching
const nameStartsWithJ = await User.find({ name: /^J/ });  // Regex
const containsOe = await User.find({ name: { $regex: 'oe', $options: 'i' } });  // Case-insensitive

// Projection with operators
const selected = await User.find()
  .select('name email')  // Include only
  .select('-password')  // Exclude
  .lean();  // Return plain JS objects (faster!)
```

---

## Example 6: lean() for Performance

```javascript
// ===================================
// WITHOUT lean() - Mongoose Documents
// ===================================
const users = await User.find({ role: 'user' });
// Returns Mongoose Documents with:
// - save() method
// - validate() method
// - getters/setters
// - virtuals
// - Overhead: ~3-5x slower

console.log(typeof users[0].save);  // 'function'

// ===================================
// WITH lean() - Plain JavaScript Objects
// ===================================
const usersLean = await User.find({ role: 'user' }).lean();
// Returns plain objects:
// - No Mongoose methods
// - No getters/setters
// - Faster: ~5x performance boost
// - Less memory

console.log(typeof usersLean[0].save);  // 'undefined'

// Use lean() for:
// ✅ API responses (read-only data)
// ✅ Reports / analytics
// ✅ Large result sets
// ✅ When you don't need to call .save()

// DON'T use lean() when:
// ❌ You need to update the document
// ❌ You need virtuals or methods
// ❌ You need schema defaults

// Optimal query pattern
const apiResponse = await User
  .find({ isActive: true })
  .select('name email role createdAt')  // Only needed fields
  .lean()  // Plain objects
  .limit(100);  // Prevent huge responses

res.json({ data: apiResponse });
```

---

## Example 7: populate() and N+1 Problem

```javascript
// ===================================
// populate() - Loading References
// ===================================
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' }
});

const Post = mongoose.model('Post', postSchema);

// Basic populate
const post = await Post.findById(postId).populate('author');
console.log(post.author.name);  // Author data loaded

// Populate specific fields only
const optimized = await Post.findById(postId)
  .populate('author', 'name email');  // Only name and email

// Populate multiple paths
const full = await Post.findById(postId)
  .populate('author', 'name')
  .populate('tags', 'name color');

// ===================================
// N+1 Problem
// ===================================
// ❌ BAD - N+1 queries
const posts = await Post.find();  // 1 query
for (const post of posts) {
  await post.populate('author');  // N queries (one per post!)
}
// Total: 1 + N queries

// ✅ GOOD - Single populate
const posts = await Post.find().populate('author');  // 2 queries total
// Query 1: Get all posts
// Query 2: Get all authors in one go

// ✅ BETTER - Use Aggregation $lookup for complex joins
const results = await Post.aggregate([
  {
    $lookup: {
      from: 'authors',
      localField: 'author',
      foreignField: '_id',
      as: 'authorData'
    }
  },
  { $unwind: '$authorData' },
  {
    $project: {
      title: 1,
      content: 1,
      'authorData.name': 1,
      'authorData.email': 1
    }
  }
]);
// Single aggregation pipeline - all done in MongoDB
```

---

## Example 8: Aggregation Pipeline

```javascript
// ===================================
// Aggregation - Multi-stage Data Processing
// ===================================

// Example: Get user statistics by role
const stats = await User.aggregate([
  // Stage 1: Filter active users only
  { $match: { isActive: true } },
  
  // Stage 2: Group by role and calculate stats
  {
    $group: {
      _id: '$role',  // Group by role field
      count: { $sum: 1 },
      avgAge: { $avg: '$age' },
      minAge: { $min: '$age' },
      maxAge: { $max: '$age' },
      users: { $push: '$name' }  // Collect names into array
    }
  },
  
  // Stage 3: Sort by count descending
  { $sort: { count: -1 } },
  
  // Stage 4: Rename _id to role
  {
    $project: {
      _id: 0,
      role: '$_id',
      count: 1,
      avgAge: { $round: ['$avgAge', 1] },
      ageRange: { min: '$minAge', max: '$maxAge' },
      userCount: '$count'
    }
  }
]);

// Result:
// [
//   { role: 'user', count: 150, avgAge: 32.5, ageRange: { min: 18, max: 75 }, userCount: 150 },
//   { role: 'admin', count: 5, avgAge: 45.2, ageRange: { min: 30, max: 60 }, userCount: 5 }
// ]

// ===================================
// $lookup - Join Collections
// ===================================
const postsWithAuthors = await Post.aggregate([
  {
    $lookup: {
      from: 'users',  // Collection name
      localField: 'author',  // Field in Post
      foreignField: '_id',  // Field in User
      as: 'authorInfo'  // Output array field
    }
  },
  { $unwind: '$authorInfo' },  // Convert array to object
  {
    $project: {
      title: 1,
      content: 1,
      'authorInfo.name': 1,
      'authorInfo.email': 1
    }
  },
  { $limit: 10 }
]);

// ===================================
// Common Aggregation Stages
// ===================================
// $match - Filter documents (like find())
// $group - Group by field and aggregate
// $project - Select/transform fields
// $sort - Sort results
// $limit/$skip - Pagination
// $lookup - Join collections
// $unwind - Deconstruct arrays
// $count - Count documents
// $addFields - Add computed fields
```

---

## Example 9: Cursor-Based Pagination

```javascript
// ===================================
// Offset Pagination (NOT recommended for large datasets)
// ===================================
router.get('/posts', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  
  const posts = await Post.find()
    .skip(skip)  // ❌ SLOW for large page numbers
    .limit(limit)
    .lean();
  
  // Problem: skip(10000) scans 10000 docs before returning results
});

// ===================================
// Cursor Pagination (RECOMMENDED)
// ===================================
router.get('/posts', async (req, res) => {
  const limit = 20;
  const { after } = req.query;  // Cursor = last document's _id
  
  const query = {};
  
  if (after) {
    // Get posts with _id greater than cursor
    query._id = { $gt: after };
  }
  
  const posts = await Post.find(query)
    .sort({ _id: 1 })  // MUST sort by indexed field (_id)
    .limit(limit + 1)  // Fetch one extra to check if there's more
    .select('title content author createdAt')
    .lean();
  
  const hasMore = posts.length > limit;
  const results = hasMore ? posts.slice(0, limit) : posts;
  
  const nextCursor = hasMore ? results[results.length - 1]._id : null;
  
  res.json({
    data: results,
    pagination: {
      limit,
      hasMore,
      nextCursor  // Client sends this as ?after=<cursor> for next page
    }
  });
});

// Benefits:
// ✅ Constant performance (no skip)
// ✅ Consistent results (no missing/duplicate items with live data)
// ✅ Uses _id index efficiently

// Cursor pagination with createdAt field
router.get('/posts/by-date', async (req, res) => {
  const limit = 20;
  const { after } = req.query;
  
  const query = {};
  
  if (after) {
    query.createdAt = { $lt: new Date(after) };  // Older than cursor
  }
  
  const posts = await Post.find(query)
    .sort({ createdAt: -1 })  // Newest first
    .limit(limit + 1)
    .lean();
  
  const hasMore = posts.length > limit;
  const results = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor = hasMore ? results[results.length - 1].createdAt : null;
  
  res.json({
    data: results,
    pagination: { limit, hasMore, nextCursor }
  });
});
```

---

## Example 10: Indexes and Performance

```javascript
// ===================================
// Creating Indexes
// ===================================
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  status: String,
  createdAt: Date
});

// Single field index
userSchema.index({ email: 1 });  // 1 = ascending, -1 = descending

// Unique index (enforces uniqueness at DB level)
userSchema.index({ email: 1 }, { unique: true });

// Compound index (queries on multiple fields together)
userSchema.index({ status: 1, createdAt: -1 });
// Efficient for: { status: 'active' } sorted by createdAt DESC

// Text index (full-text search)
userSchema.index({ bio: 'text', name: 'text' });

// TTL index (auto-delete documents after expiration)
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });  // 24 hours

// Sparse index (only documents with this field)
userSchema.index({ phone: 1 }, { sparse: true });

// ===================================
// Index Usage Analysis
// ===================================
// Check if query uses index
const result = await User.find({ email: 'test@example.com' }).explain('executionStats');

console.log(result.executionStats.executionTimeMillis);  // Query time
console.log(result.executionStats.totalDocsExamined);   // Docs scanned
console.log(result.executionStats.nReturned);           // Docs returned

// If totalDocsExamined >> nReturned → need index!

// ===================================
// Query Performance Best Practices
// ===================================
// ✅ GOOD - Uses index
await User.find({ email: 'test@example.com' });  // Has index on email

// ❌ BAD - Full collection scan
await User.find({ age: { $gt: 18 } });  // No index on age → COLLSCAN

// ✅ GOOD - Limit results
await User.find({ status: 'active' }).limit(100);

// ✅ GOOD - Select only needed fields
await User.find().select('name email').lean();

// ✅ GOOD - Add timeout to prevent long-running queries
await User.find().maxTimeMS(5000);  // Timeout after 5 seconds

// ===================================
// Index Strategy
// ===================================
// 1. Index fields used in WHERE clauses
// 2. Index fields used in sorting
// 3. Create compound indexes for common query patterns
// 4. DON'T over-index (slows writes, uses memory)
// 5. Monitor slow queries in production
// 6. Use explain() to verify index usage
```

---

## Comparison Table: Embedding vs Referencing

| Aspect | Embedding | Referencing |
|--------|-----------|-------------|
| **Storage** | Subdocuments in same document | Separate collections |
| **Queries** | Single query | Multiple queries or populate |
| **Performance** | Fast reads (one query) | Slower (join/populate) |
| **Data Size** | Limited (16MB document limit) | Unlimited |
| **Updates** | Update entire document | Update independent documents |
| **Use Case** | Address, comments (1-to-few) | Posts by user (1-to-many) |
| **Consistency** | Always consistent | Eventual (after populate) |

---

## Summary

Key Mongoose patterns for production:

1. **Connection** - Use connection pool, handle errors, graceful shutdown
2. **Schema** - Validation, indexes, timestamps
3. **CRUD** - find/create/update/delete with proper error handling
4. **lean()** - Use for read-only queries (5x faster!)
5. **populate()** - Load references, avoid N+1 problem
6. **Aggregation** - Complex queries, grouping, joins with $lookup
7. **Pagination** - Cursor-based (not offset) for large datasets
8. **Indexes** - On frequently queried/sorted fields, use explain()
9. **Performance** - select() specific fields, limit() results, maxTimeMS() timeout

MongoDB excels at flexible schemas, fast reads, and horizontal scaling!
