import "reflect-metadata";
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerDocs from './utility/swagger.utitlity';
import { ValidationMiddleware } from './middleware/validation.middleware';
import { DataSource } from 'typeorm';
import { AppError } from "./utility/apperror.utility";
import { globalErrorHandler } from "./middleware/error.middleware";
import { routes } from './routes';

dotenv.config();

export const myDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: ["src/entity/*.ts"],
    logging: false,
    synchronize: true,
    migrations: [
        "src/db/migrations/*.{.ts,.js}"
    ],
    migrationsTableName: 'migrations',
    ssl: true
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Continuing...');
    console.error(err);
});

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(ValidationMiddleware);
app.use(cors({
    credentials: true,
    origin: [`${process.env.CORS_ORIGIN}`]
}));

myDataSource.initialize().then(() => {
    routes(app);

    app.all('*', (req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });

    app.use(globalErrorHandler);

    console.log("Database has been initialized!");

    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
        swaggerDocs(app, parseInt(process.env.PORT));
    });

    process.on('unhandledRejection', (err: any) => {
        console.error('UNHANDLED REJECTION! Continuing...');
        console.error(err);
        app.use((req, res, next) => {
            next(err);
        });
    });
}).catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
