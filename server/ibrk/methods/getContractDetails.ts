import client from '../client';

export default async (conId: number) => {
	const response = await client.getContractDetails({
		conId
	});

	return response;
};
