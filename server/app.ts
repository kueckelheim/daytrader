import express from 'express';
import apiRoutes from './routes/api';
import { handler } from '../build/handler.js';

const app = express();

app.use(handler);

app.use(express.json());
app.use('/api', apiRoutes);

export default app;
