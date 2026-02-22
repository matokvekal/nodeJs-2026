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