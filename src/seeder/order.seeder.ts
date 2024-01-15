import { randomInt } from 'crypto';
import { OrderItem } from '../models/order-item.models';
import { Order } from '../models/order.models';
import { mySeeder } from './db.config';
import { fakerID_ID as faker } from "@faker-js/faker";

mySeeder.initialize().then(async () => {
    const orderRepository = mySeeder.getRepository(Order);
    const orderItemRepository = mySeeder.getRepository(OrderItem);

    for (let i = 0; i < 30; i++) {
        const order = await orderRepository.save({
            name: faker.person.fullName(),
            email: faker.internet.email(),
        })
        for (let i = 0; i < randomInt(1, 5); i++) {
            await orderItemRepository.save({
                order: order,
                product_title: faker.commerce.productName(),
                price: parseInt(faker.commerce.price({ min: 100, max: 1000, dec: 0 }), 10),
                quantity: randomInt(1, 5)
            })
        }
    }

    console.log('Seeding complete!');
    process.exit(0);
}).catch((err) => {
    console.error("Error during Data Source initialization:", err);
});