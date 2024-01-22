require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import swaggerDocs from './utility/swagger.utitlity';
import { ValidationMiddleware } from './middleware/validation.middleware';

// Initialize TypeORM connection and start the Express server
mongoose.connect('mongodb://localhost/node_admin')
    .then(() => console.log('📖 Database has been initialized!'))
    .catch((err) => console.error(err));
require('./models/order.models')
require('./models/order-item.models')

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(ValidationMiddleware);
app.use(cors({
    credentials: true,
    origin: [`${process.env.CORS_ORIGIN}`]
}));

routes(app);

app.listen(8000, () => {
    console.log('📶 Server listening on port 8000');
    swaggerDocs(app, 8000);
});