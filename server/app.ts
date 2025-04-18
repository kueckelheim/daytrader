import express from 'express';
import apiRoutes from './routes/api';
import { handler } from '../build/handler.js';

const app = express();


app.use(express.json());
app.use('/api', apiRoutes);

app.use(handler);

export default app;
