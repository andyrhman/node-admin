'use strict';

const { fakerID_ID: faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid'); // UUID for order IDs
const { randomInt } = require('crypto'); // For generating random item quantities and numbers of items

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const orders = [];
    const orderItems = [];

    for (let i = 0; i < 30; i++) {
      const orderId = uuidv4(); // Generate a UUID for the order
      orders.push({
        id: orderId, // UUID for Order
        name: faker.person.fullName(),
        email: faker.internet.email(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Generate random order items for this order
      const numberOfItems = randomInt(1, 5); // Random number of items between 1 and 4
      for (let j = 0; j < numberOfItems; j++) {
        orderItems.push({
          id: uuidv4(), // UUID for OrderItem
          orderId: orderId, // Link to the order
          product_title: faker.commerce.productName(),
          price: parseInt(faker.commerce.price({ min: 100, max: 1000, dec: 0 }), 10),
          quantity: randomInt(1, 5), // Random quantity between 1 and 4
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Insert orders first
    await queryInterface.bulkInsert('orders', orders, {});

    // Then insert order items
    await queryInterface.bulkInsert('order_items', orderItems, {});

    console.log('Seeding complete!');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
