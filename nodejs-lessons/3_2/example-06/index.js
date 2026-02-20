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