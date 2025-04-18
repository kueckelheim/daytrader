import { IBApiNext } from '@stoqey/ib';

let clientInstance: IBApiNext | null = null;

function getClient() {
	if (!clientInstance) {
		console.log('Creating IBApiNext client instance');
		clientInstance = new IBApiNext({ port: 4002 });
		console.log('Connecting to IBApi');
		clientInstance.connect(0);
	}

	return clientInstance;
}

export default getClient();
