import { MessageType, type WebSocketMessage } from '$lib/types/types';
import { writable } from 'svelte/store';

// Create a writable store to hold the WebSocket instance
export const websocket = writable<WebSocket | null>(null);

export const connectWebSocket = (url: string) => {
	const ws = new WebSocket(url);

	ws.onopen = () => {
		console.log('WebSocket connection established');
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

	// Store the WebSocket connection in the store for reuse
	websocket.set(ws);
};

// Handle incoming messages based on type
const handleMessage = (message: WebSocketMessage) => {
	switch (message.type) {
		case MessageType.ACCOUNT:
			console.log('Received account response:', message);
			break;

		default:
			console.log('Unknown message type:', message.type);
	}
};
