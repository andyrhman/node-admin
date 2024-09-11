import dotenv from 'dotenv';
dotenv.config(); // Load .env variables

export default {
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
