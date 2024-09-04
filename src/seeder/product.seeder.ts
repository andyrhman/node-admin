import { fakerID_ID as faker } from "@faker-js/faker";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

    for (let i = 0; i < 30; i++) {
        await prisma.product.create({
            data: {
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                image: faker.image.urlLoremFlickr({ width: 800, height: 800, category: 'food' }),
                price: parseInt(faker.commerce.price({ min: 100000, max: 5000000, dec: 0 }), 10)
            }
        });

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