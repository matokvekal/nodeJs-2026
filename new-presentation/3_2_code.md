# Day 3 - Presentation 2: SQL with Sequelize - Code Examples

---

## Example 1: Sequelize Setup and Connection

```javascript
// db/sequelize.js
import { Sequelize } from "sequelize";

// Option 1: Connection string
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres", // 'mysql', 'sqlite', 'mssql'
  logging: process.env.NODE_ENV === "development" ? console.log : false,

  // Connection pool configuration
  pool: {
    max: 10, // Maximum connections
    min: 2, // Minimum connections
    acquire: 30000, // Max time (ms) to get connection before error
    idle: 10000 // Max time (ms) connection can be idle before release
  },

  // Retry logic
  retry: {
    max: 3
  },

  // Timezone
  timezone: "+00:00"
});

// Option 2: Separate credentials
export const sequelize2 = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres"
});

// Test connection
export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

// In production, sync is done via migrations, NOT .sync()!
// await sequelize.sync({ alter: true });  // DON'T do this in prod!

// Graceful shutdown
export async function disconnectDB() {
  await sequelize.close();
  console.log("Database connection closed");
}
```

```bash
# Install dependencies
npm install sequelize pg pg-hstore

# For MySQL
npm install sequelize mysql2

# For SQLite (development/testing)
npm install sequelize sqlite3

# Run PostgreSQL with Docker
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  postgres:16

# Connection string
DATABASE_URL=postgresql://postgres:password@localhost:5432/mydb
```

---

## Example 2: Defining Models

```javascript
// models/User.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const User = sequelize.define(
  "User",
  {
    // id is auto-created as primary key (INTEGER AUTO_INCREMENT)

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      set(value) {
        // Custom setter - lowercase before saving
        this.setDataValue("email", value.toLowerCase());
      }
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [8, 255]
      }
    },

    role: {
      type: DataTypes.ENUM("user", "admin", "moderator"),
      defaultValue: "user",
      allowNull: false
    },

    age: {
      type: DataTypes.INTEGER,
      validate: {
        min: 18,
        max: 120
      }
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    balance: {
      type: DataTypes.DECIMAL(10, 2), // 10 digits, 2 decimals
      defaultValue: 0.0
    },

    bio: {
      type: DataTypes.TEXT, // Unlimited length
      allowNull: true
    },

    metadata: {
      type: DataTypes.JSON, // JSON or JSONB (PostgreSQL)
      defaultValue: {}
    },

    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: "users",
    timestamps: true, // Adds createdAt & updatedAt
    underscored: true, // Use snake_case column names (created_at vs createdAt)

    indexes: [
      { fields: ["email"], unique: true },
      { fields: ["role", "is_active"] },
      { fields: ["created_at"] }
    ],

    hooks: {
      // Runs before creating a user
      beforeCreate: async (user) => {
        // Hash password before saving (example)
        // user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
);
```

---

## Example 3: CRUD Operations

```javascript
import { User } from "./models/User.model.js";

// ===================================
// CREATE
// ===================================
// Single record
const user = await User.create({
  name: "John Doe",
  email: "john@example.com",
  password: "hashedpassword",
  age: 25
});

console.log(user.id); // Auto-generated ID
console.log(user.createdAt); // Auto-generated timestamp

// Bulk create
const users = await User.bulkCreate(
  [
    { name: "Alice", email: "alice@example.com", password: "pass1" },
    { name: "Bob", email: "bob@example.com", password: "pass2" }
  ],
  {
    validate: true // Run validations on each record
  }
);

// ===================================
// READ
// ===================================
// Find all
const allUsers = await User.findAll();

// Find with filter
const admins = await User.findAll({
  where: { role: "admin" }
});

// Find one
const user = await User.findOne({
  where: { email: "john@example.com" }
});

// Find by primary key
const userById = await User.findByPk(123);

// Select specific attributes
const names = await User.findAll({
  attributes: ["id", "name", "email"] // SELECT id, name, email
});

// Exclude attributes
const usersNoPassword = await User.findAll({
  attributes: { exclude: ["password"] }
});

// Ordering
const sorted = await User.findAll({
  order: [
    ["createdAt", "DESC"],
    ["name", "ASC"]
  ]
});

// Limit & Offset (pagination)
const page1 = await User.findAll({ limit: 10, offset: 0 });
const page2 = await User.findAll({ limit: 10, offset: 10 });

// Count
const count = await User.count({ where: { role: "user" } });

// Find or create
const [user, created] = await User.findOrCreate({
  where: { email: "unique@example.com" },
  defaults: { name: "Default Name", password: "pass" }
});

console.log(created); // true if created, false if found existing

// ===================================
// UPDATE
// ===================================
// Update by primary key - returns [affected_rows, updated_records]
const [updatedRows] = await User.update(
  { name: "Updated Name", age: 30 },
  { where: { id: 123 } }
);

console.log(updatedRows); // Number of rows updated

// Update with validation
await User.update(
  { email: "newemail@example.com" },
  {
    where: { id: 123 },
    validate: true // Run validations
  }
);

// Instance update
const user = await User.findByPk(123);
user.name = "New Name";
await user.save(); // Triggers validation

// Increment/Decrement
await User.increment("age", {
  by: 1,
  where: { id: 123 }
});

await User.decrement("balance", {
  by: 100,
  where: { id: 123 }
});

// ===================================
// DELETE
// ===================================
// Delete by primary key
await User.destroy({ where: { id: 123 } });

// Delete multiple
const deletedCount = await User.destroy({
  where: { isActive: false }
});

console.log(`Deleted ${deletedCount} users`);

// Soft delete (if paranoid: true in model options)
// await User.destroy({ where: { id: 123 } });  // Sets deletedAt
// await User.restore({ where: { id: 123 } });  // Restores
```

---

## Example 4: Query Operators

```javascript
import { Op } from "sequelize";

// Comparison
const adults = await User.findAll({
  where: {
    age: { [Op.gte]: 18 } // >= 18
  }
});

const range = await User.findAll({
  where: {
    age: {
      [Op.gte]: 18,
      [Op.lte]: 65
    }
  }
});

// IN / NOT IN
const roles = await User.findAll({
  where: {
    role: { [Op.in]: ["admin", "moderator"] }
  }
});

const excluded = await User.findAll({
  where: {
    role: { [Op.notIn]: ["banned", "suspended"] }
  }
});

// LIKE (pattern matching)
const nameStartsWithJ = await User.findAll({
  where: {
    name: { [Op.like]: "J%" } // Starts with J
  }
});

const containsOe = await User.findAll({
  where: {
    name: { [Op.iLike]: "%oe%" } // Case-insensitive (PostgreSQL)
  }
});

// Logical operators
const adminsOrSeniors = await User.findAll({
  where: {
    [Op.or]: [{ role: "admin" }, { age: { [Op.gte]: 60 } }]
  }
});

const activeAdmins = await User.findAll({
  where: {
    [Op.and]: [{ role: "admin" }, { isActive: true }]
  }
});

// NOT
const notAdmin = await User.findAll({
  where: {
    role: { [Op.ne]: "admin" } // Not equal
  }
});

// IS NULL / IS NOT NULL
const withoutBio = await User.findAll({
  where: {
    bio: { [Op.is]: null }
  }
});

const withBio = await User.findAll({
  where: {
    bio: { [Op.not]: null }
  }
});

// BETWEEN
const midAge = await User.findAll({
  where: {
    age: { [Op.between]: [30, 50] }
  }
});

// Complex queries
const complex = await User.findAll({
  where: {
    [Op.or]: [
      {
        [Op.and]: [{ role: "admin" }, { isActive: true }]
      },
      {
        age: { [Op.gte]: 65 }
      }
    ]
  }
});
```

---

## Example 5: Relationships (Associations)

```javascript
// models/User.model.js
export const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: DataTypes.STRING
});

// models/Post.model.js
export const Post = sequelize.define("Post", {
  title: DataTypes.STRING,
  content: DataTypes.TEXT
});

// models/Profile.model.js
export const Profile = sequelize.define("Profile", {
  bio: DataTypes.TEXT,
  avatar: DataTypes.STRING
});

// models/Role.model.js
export const Role = sequelize.define("Role", {
  name: DataTypes.STRING,
  permissions: DataTypes.JSON
});

// ===================================
// Define Relationships
// ===================================

// One-to-Many: User has many Posts
User.hasMany(Post, {
  foreignKey: "userId", // Column in Post table
  as: "posts" // Alias for eager loading
});
Post.belongsTo(User, {
  foreignKey: "userId",
  as: "author"
});

// One-to-One: User has one Profile
User.hasOne(Profile, {
  foreignKey: "userId",
  as: "profile"
});
Profile.belongsTo(User, {
  foreignKey: "userId"
});

// Many-to-Many: User belongs to many Roles
User.belongsToMany(Role, {
  through: "UserRoles", // Junction table name
  foreignKey: "userId",
  otherKey: "roleId",
  as: "roles"
});
Role.belongsToMany(User, {
  through: "UserRoles",
  foreignKey: "roleId",
  otherKey: "userId",
  as: "users"
});

// ===================================
// Querying Relationships
// ===================================

// Eager loading (JOIN) - include related data
const usersWithPosts = await User.findAll({
  include: [
    {
      model: Post,
      as: "posts",
      attributes: ["id", "title", "createdAt"],
      where: { published: true }, // Filter posts
      required: false // LEFT JOIN (true = INNER JOIN)
    }
  ]
});

// Multiple includes
const full = await User.findByPk(userId, {
  include: [
    { model: Post, as: "posts" },
    { model: Profile, as: "profile" },
    { model: Role, as: "roles" }
  ]
});

console.log(full.posts); // Array of posts
console.log(full.profile); // Profile object
console.log(full.roles); // Array of roles

// Nested includes
const nested = await User.findAll({
  include: [
    {
      model: Post,
      as: "posts",
      include: [
        {
          model: Comment, // Assuming Post hasMany Comments
          as: "comments"
        }
      ]
    }
  ]
});

// Lazy loading (separate queries)
const user = await User.findByPk(userId);
const posts = await user.getPosts(); // Separate query
const profile = await user.getProfile();
const roles = await user.getRoles();

// Create with associations
const user = await User.create(
  {
    name: "John",
    email: "john@example.com",
    posts: [
      { title: "First Post", content: "Content here" },
      { title: "Second Post", content: "More content" }
    ],
    profile: {
      bio: "Developer",
      avatar: "avatar.jpg"
    }
  },
  {
    include: [
      { model: Post, as: "posts" },
      { model: Profile, as: "profile" }
    ]
  }
);
```

---

## Example 6: Migrations

```javascript
// Generate migration
// npx sequelize-cli migration:generate --name create-users

// migrations/20260101120000-create-users.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM('user', 'admin', 'moderator'),
      defaultValue: 'user'
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });

  // Add indexes
  await queryInterface.addIndex('users', ['email'], {
    unique: true,
    name: 'users_email_unique'
  });

  await queryInterface.addIndex('users', ['role', 'is_active'], {
    name: 'users_role_active'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('users');
}

// Run migration
// npx sequelize-cli db:migrate

// Rollback migration
// npx sequelize-cli db:migrate:undo

// Add column migration
// migrations/20260101130000-add-phone-to-users.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'phone', {
    type: Sequelize.STRING(20),
    allowNull: true
  });
}

export async function down(queryInterface, Sequelize) {
  away queryInterface.removeColumn('users', 'phone');
}
```

---

## Example 7: SQL Injection Prevention

```javascript
// ❌ DANGEROUS - SQL Injection vulnerable
async function dangerousLogin(userId) {
  // NEVER DO THIS!
  const result = await sequelize.query(
    `SELECT * FROM users WHERE id = ${userId}` // Direct string interpolation
  );
  // If userId = "1 OR 1=1" → returns all users!
}

// ✅ SAFE - Parameterized queries with replacements
async function safeLogin(userId) {
  const [results] = await sequelize.query(
    "SELECT * FROM users WHERE id = ?", // Placeholder
    {
      replacements: [userId], // Securely bound
      type: QueryTypes.SELECT
    }
  );

  return results[0];
}

// ✅ SAFE - Named replacements
async function safeSearch(email, role) {
  const [results] = await sequelize.query(
    "SELECT * FROM users WHERE email = :email AND role = :role",
    {
      replacements: { email, role }, // Named placeholders
      type: QueryTypes.SELECT
    }
  );

  return results;
}

// ✅ SAFE - Using Sequelize ORM (automatic parameterization)
async function ormQuery(userId) {
  const user = await User.findByPk(userId);
  // Sequelize automatically uses parameterized queries
  return user;
}

// ===================================
// Raw Queries (when needed)
// ===================================
import { QueryTypes } from "sequelize";

// Safe raw query
const users = await sequelize.query(
  "SELECT id, name, email FROM users WHERE age > :minAge ORDER BY created_at DESC",
  {
    replacements: { minAge: 18 },
    type: QueryTypes.SELECT,
    raw: true // Return raw results (no model instances)
  }
);

// Why use raw queries?
// - Complex queries not easily expressed in Sequelize
// - Performance-critical operations
// - Database-specific features

// ALWAYS use replacements, NEVER template literals!
```

---

## Example 8: Transactions

```javascript
import { sequelize } from "./db/sequelize.js";

// ===================================
// Managed Transactions (Recommended)
// ===================================
async function transferMoney(senderId, receiverId, amount) {
  // Sequelize automatically commits or rolls back
  const result = await sequelize.transaction(async (t) => {
    // All queries in this callback use the transaction

    const sender = await User.findByPk(senderId, { transaction: t });
    const receiver = await User.findByPk(receiverId, { transaction: t });

    if (!sender || !receiver) {
      throw new Error("User not found");
    }

    if (sender.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Deduct from sender
    await sender.decrement("balance", { by: amount, transaction: t });

    // Add to receiver
    await receiver.increment("balance", { by: amount, transaction: t });

    // Create transaction record
    await Transaction.create(
      {
        senderId,
        receiverId,
        amount,
        status: "completed"
      },
      { transaction: t }
    );

    return { success: true };
  });

  // If any error is thrown, automatic rollback happens
  // Otherwise, automatic commit

  return result;
}

// ===================================
// Unmanaged Transactions (Manual control)
// ===================================
async function manualTransaction(senderId, receiverId, amount) {
  const t = await sequelize.transaction();

  try {
    const sender = await User.findByPk(senderId, { transaction: t });
    const receiver = await User.findByPk(receiverId, { transaction: t });

    await sender.decrement("balance", { by: amount, transaction: t });
    await receiver.increment("balance", { by: amount, transaction: t });

    await t.commit(); // Manual commit
    return { success: true };
  } catch (error) {
    await t.rollback(); // Manual rollback
    throw error;
  }
}

// ===================================
// Isolation Levels
// ===================================
import { Transaction } from "sequelize";

await sequelize.transaction(
  {
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  },
  async (t) => {
    // Most strict isolation - prevents all concurrency issues
    // Use for critical financial operations
  }
);

// Levels (from least to most strict):
// - READ_UNCOMMITTED
// - READ_COMMITTED (default in PostgreSQL)
// - REPEATABLE_READ (default in MySQL)
// - SERIALIZABLE

// ===================================
// Transaction with Lock
// ===================================
await sequelize.transaction(async (t) => {
  const user = await User.findByPk(userId, {
    lock: t.LOCK.UPDATE, // Lock row for update
    transaction: t
  });

  user.balance += 100;
  await user.save({ transaction: t });
});
```

---

## Example 9: Validations

```javascript
const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Built-in email validation
      notEmpty: true
    }
  },

  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 18, // Minimum value
      max: 120, // Maximum value
      isInt: true // Must be integer
    }
  },

  website: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true // Built-in URL validation
    }
  },

  ipAddress: {
    type: DataTypes.STRING,
    validate: {
      isIP: true, // IP address validation
      isIPv4: true // Or isIPv6
    }
  },

  role: {
    type: DataTypes.STRING,
    validate: {
      isIn: [["user", "admin", "moderator"]] // Must be one of these
    }
  },

  username: {
    type: DataTypes.STRING,
    validate: {
      len: [3, 20], // Length between 3 and 20
      is: /^[a-z0-9_]+$/i, // Alphanumeric + underscore only
      not: /admin/i // Cannot contain 'admin'
    }
  },

  creditCard: {
    type: DataTypes.STRING,
    validate: {
      isCreditCard: true
    }
  },

  // Custom validation
  password: {
    type: DataTypes.STRING,
    validate: {
      strongPassword(value) {
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          throw new Error(
            "Password must contain uppercase, lowercase, and number"
          );
        }
      }
    }
  },

  // Async validation
  email: {
    type: DataTypes.STRING,
    validate: {
      async isUnique(value) {
        const existing = await User.findOne({ where: { email: value } });
        if (existing && existing.id !== this.id) {
          throw new Error("Email already exists");
        }
      }
    }
  }
});

// Model-level validations (across multiple fields)
User.validate = function () {
  if (this.age < 18 && this.role === "admin") {
    throw new Error("Admins must be at least 18 years old");
  }
};

// Handling validation errors
try {
  await User.create({ email: "invalid-email", age: 15 });
} catch (error) {
  if (error.name === "SequelizeValidationError") {
    error.errors.forEach((err) => {
      console.log(`${err.path}: ${err.message}`);
    });
  }
}
```

---

## Comparison Table: MongoDB vs SQL

| Aspect             | MongoDB               | SQL (Sequelize)                 |
| ------------------ | --------------------- | ------------------------------- |
| **Structure**      | Flexible documents    | Fixed schema (tables)           |
| **Relationships**  | Embed or reference    | Foreign keys + JOINs            |
| **Queries**        | find(), aggregate()   | WHERE, JOIN, GROUP BY           |
| **ACID**           | Document level        | Full transactions               |
| **Schema changes** | No migration needed   | Migrations required             |
| **Scaling**        | Horizontal (sharding) | Vertical + read replicas        |
| **Use cases**      | CMS, catalogs, logs   | Finance, ERP, complex relations |
| **Performance**    | Fast reads            | Fast complex joins              |

---

## Summary

Sequelize best practices for production:

1. **Connection** - Pool configuration, error handling
2. **Models** - Validations, indexes, timestamps
3. **CRUD** - Use ORM methods (automatic SQL injection protection)
4. **Operators** - Op.gte, Op.like, Op.or for complex queries
5. **Relationships** - hasMany, belongsTo, belongsToMany + include for eager loading
6. **Migrations** - NEVER use sync() in production, always migrations
7. **SQL Injection** - ALWAYS use replacements for raw queries
8. **Transactions** - Use for multi-step operations requiring atomicity
9. **Validation** - Built-in + custom validators
10. **Raw Queries** - Use replacements, never template literals

SQL databases excel at complex relationships, data integrity, and ACID transactions!
