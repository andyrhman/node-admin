import { randomInt } from 'crypto';
import { fakerID_ID as faker } from "@faker-js/faker";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    for (let i = 0; i < 30; i++) {
        const order = await prisma.order.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
            }
        });
        for (let i = 0; i < randomInt(1, 5); i++) {
            await prisma.orderItem.create({
                data: {
                    order_id: order.id,
                    productTitle: faker.commerce.productName(),
                    price: parseInt(faker.commerce.price({ min: 100, max: 1000, dec: 0 }), 10),
                    quantity: randomInt(1, 5)
                }
            });
        }
    }

    console.log('Seeding complete!');
}
main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
