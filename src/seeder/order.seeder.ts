// import { randomInt } from 'crypto';
// import { OrderItem } from '../models/order-items';
// import { Order } from '../models/order';
// import { fakerID_ID as faker } from "@faker-js/faker";
// import mongoose from 'mongoose';

// mongoose.connect('mongodb://localhost/node_admin').then(async () => {
//     for (let i = 0; i < 30; i++) {
//         const order = await Order.create({
//             name: faker.person.fullName(),
//             email: faker.internet.email(),
//             order_items: [] // Initialize the array
//         });
//         for (let j = 0; j < randomInt(1, 5); j++) {
//             const orderItem = await OrderItem.create({
//                 product_title: faker.commerce.productName(),
//                 price: faker.commerce.price({ min: 100, max: 1000, dec: 0 }),
//                 quantity: randomInt(1, 5),
//             });
//             order.order_items.push(orderItem); // Push the new order item to the order's items
//         }
//         await order.save();
//     }

//     console.log('Seeding complete!');
//     process.exit(0);
// }).catch((err) => {
//     console.error("Error during Data Source initialization:", err);
// });
