import { Product } from '../entity/product.entity';
import { mySeeder } from './db.config';
import { fakerID_ID as faker } from "@faker-js/faker";

mySeeder.initialize().then(async () => {
    const repository = mySeeder.getRepository(Product);

    for (let i = 0; i < 30; i++) {
        await repository.save({
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            image: faker.image.urlLoremFlickr({ width: 800, height: 800, category: 'food' }),
            price: parseInt(faker.commerce.price({ min: 100000, max: 5000000, dec: 0 }), 10),
        })
        
    }

    console.log('Seeding complete!');
    process.exit(0);
}).catch((err) => {
    console.error("Error during Data Source initialization:", err);
});