import client from '../client';

export default async (query: string) => {
	const response = await client.getMatchingSymbols(query);
	console.log(response);

	return response
		.filter(
			({ contract }) =>
				!!contract &&
				!!contract.conId &&
				contract.conId !== -1 &&
				!!contract.symbol &&
				contract.secType === 'STK' &&
				contract.currency === 'USD' &&
				!contract.symbol.includes('USD') &&
				contract.primaryExch &&
				['NASDAQ', 'NYSE', 'ARCA', 'BATS', 'IEX'].includes(contract.primaryExch)
		)
		.map(({ contract }) => contract);
};
