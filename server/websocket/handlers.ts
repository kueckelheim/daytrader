import WebSocket from 'ws';

export function handleWebSocket(ws: WebSocket) {
	ws.on('message', (msg) => {
		ws.send(`Echo: ${msg}`);
	});
	ws.on('close', () => {
		console.log('Client disconnected');
	});
}
