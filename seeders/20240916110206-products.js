'use strict';
const { fakerID_ID: faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const products = [];

    for (let i = 0; i < 30; i++) {
      products.push({
        id: uuidv4(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image: faker.image.urlLoremFlickr({ width: 800, height: 800, category: 'food' }),
        price: parseInt(faker.commerce.price({ min: 100000, max: 5000000, dec: 0 }), 10),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('products', products, {});
    console.log('Seeding complete!');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
