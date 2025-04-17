export interface SubscribeAccountMessage {
	type: MessageType.SUBSCRIBE_ACCOUNT;
}

export interface AccountUpdateMessage {
	type: MessageType.ACCOUNT_UPDATE;
	data: Account;
}

export enum MessageType {
	SUBSCRIBE_ACCOUNT = 'SUBSCRIBE_ACCOUNT',
	ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
	POSITIONS = 'POSITIONS'
}

export type WebSocketMessage = SubscribeAccountMessage | AccountUpdateMessage;

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

export interface Position {
	id?: number;
	symbol: string; // Symbol of the stock or asset being traded
	entryPoint: number; // Price at which the position is entered
	stopLoss: number; // Price at which the position will be sold to prevent further loss
	target?: number; // Price at which the position aims to be exited for profit
	entryDate: EpochTimeStamp; // Timestamp of the entry
	quantity: number; // Number of units being traded
	exitPoint?: number; // Price at which the position was sold
	exitDate?: EpochTimeStamp; // Timestamp of the exit
}
