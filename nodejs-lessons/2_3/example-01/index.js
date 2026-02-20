// ✅ GOOD - RESTful resource names (nouns, plural)
GET / api / v1 / users; // Get all users
GET / api / v1 / users / 123; // Get specific user
POST / api / v1 / users; // Create new user
PUT / api / v1 / users / 123; // Update entire user
PATCH / api / v1 / users / 123; // Partial update user
DELETE / api / v1 / users / 123; // Delete user

// Nested resources
GET / api / v1 / users / 123 / posts; // Get user's posts
POST / api / v1 / users / 123 / posts; // Create post for user
DELETE / api / v1 / users / 123 / posts / 456; // Delete specific post

// ❌ BAD - Using verbs in URLs
GET / api / v1 / getUsers;
POST / api / v1 / createUser;
POST / api / v1 / deleteUser / 123;
GET / api / v1 / getUserPosts / 123;

// ✅ GOOD - Actions that don't fit CRUD
POST / api / v1 / users / 123 / activate; // Activate user
POST / api / v1 / orders / 456 / cancel; // Cancel order
POST / api / v1 / auth / login; // Login
POST / api / v1 / auth / logout; // Logout
POST / api / v1 / password / reset; // Password reset