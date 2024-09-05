require('dotenv').config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerDocs from './utility/swagger.utitlity';
import cloudinary from "cloudinary";
import { routes } from './routes';
import { ValidationMiddleware } from './middleware/validation.middleware';
import { AppError } from "./utility/apperror.utility";
import { globalErrorHandler } from "./middleware/error.middleware";

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Continuing...');
    console.error(err);
});

const app = express();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
