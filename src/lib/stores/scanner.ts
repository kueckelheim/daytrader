import type { ScanMatch } from '$lib/types/types';
import { writable } from 'svelte/store';

export const matches = writable<ScanMatch[]>([]);
