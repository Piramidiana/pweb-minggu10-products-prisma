import express from 'express';
import { cors } from './middleware/cors.js';
import { requestLogger } from './middleware/request-logger.js';
import { notFound, errorHandler } from './middleware/error-handler.js';
import productsRouter from './routes/products.routes.js';

const app = express();

app.use(cors);
app.use(express.json());
app.use(requestLogger);
app.use('/products', productsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;