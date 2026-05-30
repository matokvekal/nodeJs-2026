import Sequelize from 'sequelize';

const initDatabase = async (config) => {
  const sequelize = new Sequelize(
    config.NAME,
    config.USER,
    config.PASSWORD,
    {
      host: config.HOST,
      port: config.PORT,
      dialect: config.dialect,
      logging: false,
      pool: config.pool,
    }
  );

  try {
    await sequelize.authenticate();
    console.log('Connection to Database has been established successfully.');
  } catch (error) {
    console.log('Unable to connect to the database:', error);
  }

  return { sequelize };
};

export default initDatabase;
