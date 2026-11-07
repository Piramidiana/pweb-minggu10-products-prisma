import express from 'express';
import { requestLogger } from './middleware/request-logger.js';
import { notFound, errorHandler } from './middleware/error-handler.js';
import productsRouter from './routes/products.routes.js';

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use('/products', productsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;