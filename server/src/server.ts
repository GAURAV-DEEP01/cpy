import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env';
import { connectDB } from './config/db';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.CLIENT_URL }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
app.use('/api', routes);

// Error handling
app.use(errorMiddleware);

export default app;
