require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: 'C36g4f,15',
    database: 'amida',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: console.log
  },
  test: {
    username: 'postgres',
    password: 'C36g4f,15',
    database: 'amida_test',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: 'postgres',
    password: 'C36g4f,15',
    database: 'amida',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
  }
}; 