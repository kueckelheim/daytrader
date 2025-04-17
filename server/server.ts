import http from 'http';
import { setupWebSocket } from './websocket/index.js';
import app from './app.ts';

const server = http.createServer(app);
setupWebSocket(server)

server.listen(3000, () => {
	console.log('listening on port 3000');
});
