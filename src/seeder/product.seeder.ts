import mongoose from "mongoose";
import { Product } from "../models/product.models";
import { fakerID_ID as faker } from "@faker-js/faker";

mongoose.connect('mongodb://localhost/node_admin').then(async () => {

    for (let i = 0; i < 30; i++) {
        await Product.create({
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            image: faker.image.urlLoremFlickr({ width: 800, height: 800, category: 'food' }),
            price: parseInt(faker.commerce.price({ min: 100000, max: 5000000, dec: 0 }), 10),
        })
        
    }

    console.log('🌱 Seeding complete!');
    process.exit(0);
}).catch((err) => {
    console.error("Error during Data Source initialization:", err);
});