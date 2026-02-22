export default {
  NAME: 'db',
  USER: 'root',
  PASSWORD: 'a1a1a1',
  HOST: 'localhost',
  PORT: 3306,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
