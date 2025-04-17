import { handler } from '../build/handler.js';
import express from 'express';
import { IBApiNext } from '@stoqey/ib';

const app = express();

const ibkrClient = new IBApiNext({
	port: 4002
});
ibkrClient.connect();
// create a server directory structure (e.g., 'server/')
// you could place server-related logic such as routes and middlewares here

app.get('/healthcheck', (req, res) => {
	res.end('ok');
});
app.use(handler);

app.listen(3000, () => {
	console.log('listening on port 3000');
});
