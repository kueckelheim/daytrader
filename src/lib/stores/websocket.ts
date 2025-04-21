import { MessageType, type WebSocketMessage } from '$lib/types/types';
import { writable } from 'svelte/store';
import { account, openOrders, pnl, positions } from './account';
import { matches } from './scanner';

// Create a writable store to hold the WebSocket instance
export const websocket = writable<WebSocket | null>(null);

export const connectWebSocket = (url: string) => {
	const ws = new WebSocket(url);

	ws.onopen = () => {
		console.log('WebSocket connection established');
		// Store the WebSocket connection in the store for reuse
		websocket.set(ws);
	};

	ws.onmessage = (event) => {
		const message: WebSocketMessage = JSON.parse(event.data);
		handleMessage(message);
	};

	ws.onclose = () => {
		console.log('WebSocket connection closed');
	};

	ws.onerror = (error) => {
		console.error('WebSocket error:', error);
	};
};

// Handle incoming messages based on type
const handleMessage = (message: WebSocketMessage) => {
	switch (message.type) {
		case MessageType.ACCOUNT_UPDATE:
			account.set(message.data);
			break;
		case MessageType.OPEN_ORDERS_UPDATE:
			openOrders.set(message.data);
			break;
		case MessageType.POSITIONS_UPDATE:
			positions.set(message.data);
			break;
		case MessageType.DAILY_PNL:
			console.log('Recevied pnl update:', message.data);
			pnl.set(message.data);
			break;
		case MessageType.SCAN_UPDATE:
			console.log('Received scan update:', message);
			matches.set(message.data);
			break;
	}
};
