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

`ATTENTION !!!`

TLDR -> Use `CommonJS` for Sequelize

This is probably the most difficult and complicated first time configuration that i got in a while, so based on my experiments using this on `ES Module` i must say the error when running seed database is so enourmous that i have to changed to using `CommonJS`, so future Andy do your self a favour and just use `CommonJS` for Sequelize.

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

Change `config/config.json` into `config/config.js`

```javascript
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

Run this command

```bash
npx sequelize-cli model:generate --name user --attributes username:string,password:string,email:string,createdAt:DATE,updatedAt:DATE
```

```javascript
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'role_id' });

    }
  };

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeCreate: (user) => {
        user.email = user.email.toLowerCase();
        user.username = user.username.toLowerCase();
      },
      beforeUpdate: (user) => {
        user.email = user.email.toLowerCase();
        user.username = user.username.toLowerCase();
      },
    },
  });

  return Role;
};
```

For Sequelize you would need to create your own migration file or after create a model using the CLI it automatically generate your migration file with the schema, becasuse this is different than `TypeORM` and `Prisma`.

Here is the command to generate migration file:

```bash
npx sequelize-cli migration:generate --name create-users-table
```

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

Seeding Database:

```bash
npx sequelize-cli seed:generate --name <insert name here>
```

Here is the example of seeding data using sequelize:

```javascript
console.log("not completed yet, still on development");
```

After you have done coded the seeder run this command:

```bash
npx sequelize-cli db:seed --seed 20240913082700-roles-permissions.js
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
