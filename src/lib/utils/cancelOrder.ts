export default async (orderId: number) => {
	const response = await fetch(`/api/order?orderId=${orderId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
};
