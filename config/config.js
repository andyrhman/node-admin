const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true
      }
    },
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    host: process.env.POSTGRES_HOST,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true
      }
    },
    dialect: 'postgres',
  },
  production: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    host: process.env.POSTGRES_HOST,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true
      }
    },
    dialect: 'postgres',
  },
};