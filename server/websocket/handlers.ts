import WebSocket from 'ws';
import { WebSocketMessage, MessageType, AccountMessage } from '../../src/lib/types/types';

export function handleWebSocket(ws: WebSocket) {
	ws.on('message', (msg) => {
		const message: WebSocketMessage = JSON.parse(msg.toString());

		switch (message.type) {
			case MessageType.ACCOUNT:
				handleAccount(ws, message as AccountMessage);
				break;
			default:
				console.log('Unknown message type:', message.type);
				ws.send(JSON.stringify(`Echo`));
		}
	});
	ws.on('close', () => {
		console.log('Client disconnected');
	});
}

const handleAccount = (ws: WebSocket, message: AccountMessage) => {
	console.log(message);
	const response: AccountMessage = {
		type: MessageType.ACCOUNT,
		data: {
			userId: message.data.userId // Echoing back the same userId or adding additional data
		}
	};

	// Send the response back to the client
	ws.send(JSON.stringify(response));
};
