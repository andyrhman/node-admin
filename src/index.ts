import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import { DataSource } from 'typeorm';

require('dotenv').config();
export const myDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [
        "src/entity/*.ts"
    ],
    logging: false,
    synchronize: true
});

const app = express();
app.use(express.json());
app.use(cors({
    origin: [`${process.env.CORS_ORIGIN}`]
}));

// Initialize TypeORM connection and start the Express server
myDataSource.initialize().then(() => {
    routes(app);

    console.log("Data Source has been initialized!");
    app.listen(8000, () => {
        console.log('Server listening on port 8000');
    });
}).catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
