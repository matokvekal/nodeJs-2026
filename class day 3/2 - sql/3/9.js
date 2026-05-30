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
    throw new Error("Admins must be at least 18 years old");
  }
};

// Handling validation errors
try {
  await User.create({ email: "invalid-email", age: 15 });
} catch (error) {
    error.errors.forEach((err) => {
      console.log(`${err.path}: ${err.message}`);
    });
  }
}