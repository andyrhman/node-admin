require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import { DataSource } from 'typeorm';
import cookieParser from 'cookie-parser';
import { ValidationMiddleware } from './middleware/validation.middleware';
import swaggerDocs from './utility/swagger.utitlity';
import { AppError } from "./utility/apperror.utility";
import { globalErrorHandler } from "./middleware/error.middleware";

// ! TO BE DELETED
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
    synchronize: true,
    ssl: true
});


process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Continuing...');
    console.error(err);
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(ValidationMiddleware);
app.use(cors({
    credentials: true,
    origin: [`${process.env.CORS_ORIGIN}`]
}));

routes(app);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

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
