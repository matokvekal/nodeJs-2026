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