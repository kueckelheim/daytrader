/**
 * This TypeScript file is designed to manage market scanning for stock instruments.
 * It utilizes the '@stoqey/ib' library to interact with Interactive Brokers (IB) and capture instruments that
 * meet specific scanning criteria. The two main scans performed are:
 *
 * 1. "Hot By Volume": Stocks in the US with a price between $1 and $25 and a high trading volume.
 * 2. "Top Percentage Gainers": Stocks in the US with a price between $1 and $25 that have high percentage gains.
 *
 * Additional filters include conditions such as trading rate, volume, market cap, and percentage change.
 *
 * The program subscribes to market scanner updates and processes any new or changed data it receives.
 * It maintains a list of matches and sorts them by priority.
 * Functions are provided for subscribing to these scans and handling updates or errors.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Instrument,
	LocationCode,
	MarketScannerRows,
	ScanCode,
	ScannerSubscription,
	TagValue
} from '@stoqey/ib';
import client from '../client';
import { ScanMatch } from '../../../src/lib/types/types';

// Define subscription options for the "Hot By Volume" scan
const hotByVolume = {
	numberOfRows: 50,
	instrument: Instrument.STK,
	scanCode: ScanCode.HOT_BY_VOLUME,
	locationCode: LocationCode.STK_US,
	abovePrice: 1,
	belowPrice: 25,
	stockTypeFilter: 'CORP'
};

// Define subscription options for the "Top Percentage Gainers" scan
const topPercGain = {
	numberOfRows: 50,
	instrument: Instrument.STK,
	scanCode: ScanCode.TOP_PERC_GAIN,
	locationCode: LocationCode.STK_US,
	abovePrice: 1,
	belowPrice: 25,
	stockTypeFilter: 'CORP'
};

// Define additional filter options for the market scan
const filterOptions = [
	{ tag: 'tradeRateAbove', value: '50' },
	{ tag: 'volumeAbove', value: '10000' },
	{ tag: 'marketCapBelow1e6', value: '1000' },
	{ tag: 'changePercAbove', value: '7' }
];

// Initialize an empty array to hold the scanner matches
const matches: ScanMatch[] = [];

// Process the market scanner rows to extract relevant matches
const getMatches = (rows: MarketScannerRows, isHotByVolume) => {
	const matchMap = new Map<number, ScanMatch>();

	// Iterate over each row and extract relevant data
	for (const item of rows.values()) {
		const conId = item.contract.contract.conId!;
		matchMap.set(conId, {
			symbol: item.contract.contract.symbol!,
			isHotByVolume: !!isHotByVolume,
			isTopGainer: !isHotByVolume,
			conId: item.contract.contract.conId,
			exchange: item.contract.contract.exchange,
			currency: item.contract.contract.currency,
			tradingHours: item.contract.tradingHours,
			contract: item.contract.contract
		});
	}

	matchMap.forEach((match, conId) => {
		// If a match already exists, we update it (merge)
		const existingMatch = matches.find((m) => m.conId === conId);
		if (existingMatch) {
			Object.assign(existingMatch, {
				...match,
				isHotByVolume: existingMatch.isHotByVolume || match.isHotByVolume,
				isTopGainer: existingMatch.isTopGainer || match.isTopGainer
			});
		} else {
			// If no match exists, we add it to the list
			matches.push(match);
		}
	});
};

const sort = () => {
	// Sort the matches based on priority, prioritizing those that meet both conditions
	return matches.sort((a, b) => {
		const aPriority = Number(a.isHotByVolume && a.isTopGainer);
		const bPriority = Number(b.isHotByVolume && b.isTopGainer);
		return bPriority - aPriority; // Higher priority comes first
	});
};

// Subscribe to a market scanner and handle updates
const scan = (
	onUpdate: (update: any) => void,
	subscriptionOptions: ScannerSubscription,
	filterOptions: TagValue[],
	isHotByVolume: boolean
) => {
	client.getMarketScanner(subscriptionOptions, [], filterOptions).subscribe({
		next: (value) => {
			const initialLength = matches.length;

			if (value.added) {
				getMatches(value.added, isHotByVolume);
			} else if (value.changed) {
				getMatches(value.changed, isHotByVolume);
			}

			if (initialLength !== matches.length) {
				onUpdate(sort());
			}
		},
		complete: () => {
			console.log('Done!');
		},
		error: (err) => {
			console.error('HotByVolume error:', err);
		}
	});
};

// Exported function to initiate subscriptions to market scanners
export function subscribeToScanner(onUpdate: (update: any) => void, onError: (err: any) => void) {
	try {
		console.log('Start scanner');

		// Subscribe to both "Hot By Volume" and "Top Percentage Gainers" scans
		scan(onUpdate, topPercGain, filterOptions, false);
		scan(onUpdate, hotByVolume, filterOptions, true);
	} catch (err) {
		console.error('Failed to scan:', err);
		onError(err);
	}
}
