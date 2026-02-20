// db/sequelize.js
import { Sequelize } from "sequelize";

// Option 1: Connection string
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres", // 'mysql', 'sqlite', 'mssql'

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