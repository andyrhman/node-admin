# Node Admin with Express server

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/300px-Node.js_logo.svg.png" />
</p>

## Introduction

Provide a brief overview of your Node.js admin server, explaining its purpose and key features.

## First Time Set Up & Configuration

Create the directory:

```bash
mkdir node-admin
npm init -y
```

## Using Sequelize

Install sequelize:

```bash
# Using PostgreSQL
npm install sequelize sequelize-cli pg pg-hstore
```

```bash
# Using MySQL
npm install sequelize sequelize-cli mysql2
```

Initialize Sequelize

```bash
npx sequelize-cli init
```

Change config/config.json into config/config.js

```javascript
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
```

Create User models:

```javascript
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};
```

For Sequelize you would need to create your own migration file, becasuse this is different than `TypeORM` and `Prisma`.
Here is the command to generate migration file:

```bash
npx sequelize-cli migration:generate --name create-users-table
```

Now after you generate the migration file using the command above, now if you use `ES Module` rename the migration file `.js` into `.cjs`
to avoid error when migrating.

Here is the migration code:

```javascript
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
```

## Nodemon

Create a file called `nodemon.json` and copy this code

```json
{
    "ignore": [
      ".git",
      "node_modules/",
      "dist/",
      "coverage/"
    ],
    "watch": [
      "src/*"
    ],
    "ext": "js,json,ts"
  }
```

## Features

List the main features of your admin server. For example:

- User authentication and authorization
- CRUD operations for managing resources
- Logging and monitoring
- User Roles

## Requirements

Outline the prerequisites and dependencies needed to run your admin server. For example:

- Node.js (version)
- npm or yarn
- Database (if applicable)

## Installation

Provide step-by-step instructions for installing and setting up the project locally. Include commands and any additional configurations. For example:

```bash
git clone https://github.com/andyrhman/node-admin.git
cd node-admin
npm install
