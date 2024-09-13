require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { routes } = require('./routes.js');
const { ValidationMiddleware } = require('./middleware/validation.middleware.js');
const { AppError } = require('./utility/apperror.utility.js');
const globalErrorHandler = require('./middleware/error.middleware.js');
const swaggerDocs = require('./utility/swagger.utitlity.js');

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

console.log("Database has been initialized!");

app.listen(8000, () => {
    console.log('Server listening on port 8000');
    swaggerDocs(app, 8000);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Continuing...');
    console.error(err);
    app.use((req, res, next) => {
        next(err);
    });
});