import type { Bar, Contract, OpenOrder, PnLSingle, Position } from '@stoqey/ib';

export interface SubscribePositionsMessage {
	type: MessageType.SUBSRIBE_POSITIONS_UPDATE;
}

export interface UnsubscribePositionsMessage {
	type: MessageType.UNSUBSRIBE_POSITIONS_UPDATE;
}

export interface PositionsUpdateMessage {
	type: MessageType.POSITIONS_UPDATE;
	data: Position[];
}

export interface SubscribeOpenOrdersMessage {
	type: MessageType.SUBSCRIBE_OPEN_ORDERS;
}

export interface UnsubscribeOpenOrdersMessage {
	type: MessageType.UNSUBSCRIBE_OPEN_ORDERS;
}

export interface OpenOrdersUpdateMessage {
	type: MessageType.OPEN_ORDERS_UPDATE;
	data: OpenOrder[];
}

export interface LatestBarMessage {
	type: MessageType.LASTEST_BAR;
	data: Bar;
}

export interface SubscribeLastestBarMessage {
	type: MessageType.SUBSCRIBE_LASTEST_BAR;
	data: Contract;
}

export interface SubscribeAccountMessage {
	type: MessageType.SUBSCRIBE_ACCOUNT;
}

export interface SubscribeScanner {
	type: MessageType.SUBSCRIBE_SCAN;
}

export interface AccountUpdateMessage {
	type: MessageType.ACCOUNT_UPDATE;
	data: Account;
}

export interface ScanUpdateMessage {
	type: MessageType.SCAN_UPDATE;
	data: ScanMatch[];
}

export interface SubscribePNL {
	type: MessageType.SUBSCRIBE_PNL_POSITION;
	data: {
		accountId: string;
		conId: number;
	};
}

export interface UnsubscribePNL {
	type: MessageType.UNSUBSCRIBE_PNL_POSITION;
	data: {
		accountId: string;
		conId: number;
	};
}

export interface PNLUpdate {
	type: MessageType.PNL_UPDATE_POSITION;
	data: PnLSingle;
}

export enum MessageType {
	UNSUBSCRIBE_PNL_POSITION = 'UNSUBSCRIBE_PNL_POSITION',
	SUBSCRIBE_PNL_POSITION = 'SUBSCRIBE_PNL_POSITION',
	PNL_UPDATE_POSITION = 'PNL_UPDATE_POSITION',
	SUBSCRIBE_ACCOUNT = 'SUBSCRIBE_ACCOUNT',
	SUBSCRIBE_SCAN = 'SUBSCRIBE_SCAN',
	ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
	SCAN_UPDATE = 'SCAN_UPDATE',
	POSITIONS = 'POSITIONS',
	LASTEST_BAR = 'LASTEST_BAR',
	SUBSCRIBE_LASTEST_BAR = 'SUBSCRIBE_LASTEST_BAR',
	SUBSCRIBE_OPEN_ORDERS = 'SUBSCRIBE_OPEN_ORDERS',
	UNSUBSCRIBE_OPEN_ORDERS = 'UNSUBSCRIBE_OPEN_ORDERS',
	OPEN_ORDERS_UPDATE = 'OPEN_ORDERS_UPDATE',
	SUBSRIBE_POSITIONS_UPDATE = 'SUBSRIBE_POSITIONS_UPDATE',
	UNSUBSRIBE_POSITIONS_UPDATE = 'UNSUBSRIBE_POSITIONS_UPDATE',
	POSITIONS_UPDATE = 'POSITIONS_UPDATE'
}

export type WebSocketMessage =
	| SubscribeAccountMessage
	| AccountUpdateMessage
	| SubscribeScanner
	| ScanUpdateMessage
	| LatestBarMessage
	| SubscribeLastestBarMessage
	| OpenOrdersUpdateMessage
	| SubscribeOpenOrdersMessage
	| UnsubscribeOpenOrdersMessage
	| SubscribePositionsMessage
	| PositionsUpdateMessage
	| UnsubscribePositionsMessage
	| SubscribePNL
	| UnsubscribePNL
	| PNLUpdate;

export type DataPoint = {
	x: number | undefined; // timestamp
	h: number | undefined; // high price
	l: number | undefined; // low price
	o: number | undefined; // open price
	c: number | undefined; // close price
	v: number | undefined; // volume
};

export const CHART_RANGE = {
	M10: 10,
	M30: 30,
	H1: 60,
	H2: 120,
	H5: 300,
	D1: 60 * 24,
	D3: 60 * 24 * 3
};

export enum SPINNER_SIZE {
	XS = 'xs',
	SM = 'sm',
	MD = 'md',
	LG = 'lg'
}

export enum TOAST_MESSAGE_TYPES {
	ERROR = 'error',
	SUCCESS = 'success',
	INFO = 'info'
}

export type ToastMessage = {
	title: string;
	message: string;
	toastType: TOAST_MESSAGE_TYPES;
};

export type Account = {
	availableFundsEUR: number | null;
	availableFundsUSD: number | null;
	accountId: string | null;
};

// export interface Position {
// 	id?: number;
// 	symbol: string; // Symbol of the stock or asset being traded
// 	entryPoint: number; // Price at which the position is entered
// 	stopLoss: number; // Price at which the position will be sold to prevent further loss
// 	target?: number; // Price at which the position aims to be exited for profit
// 	entryDate: EpochTimeStamp; // Timestamp of the entry
// 	quantity: number; // Number of units being traded
// 	exitPoint?: number; // Price at which the position was sold
// 	exitDate?: EpochTimeStamp; // Timestamp of the exit
// }

export type ScanMatch = {
	symbol: string;
	isTopGainer: boolean;
	isHotByVolume: boolean;
	conId: number | undefined;
	exchange: string | undefined;
	currency: string | undefined;
	tradingHours: string | undefined;
	contract: Contract;
};
