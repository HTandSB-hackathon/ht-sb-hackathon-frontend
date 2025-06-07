import { atomWithRefresh, loadable } from "jotai/utils";

import {
	type Event,
	type FukushimaWeek,
	getEvents,
	getFukushimaWeeks,
} from "../domain/EventQuery";

export const eventsAtomAsync = atomWithRefresh<Promise<Event[] | null>>(
	async () => {
		try {
			const response = await getEvents();
			return response;
		} catch (error) {
			console.error("Error fetching health check:", error);
			return null;
		}
	},
);

export const fukushimaWeeksAtomAsync = atomWithRefresh<
	Promise<FukushimaWeek[] | null>
>(async () => {
	try {
		const response = await getFukushimaWeeks();
		return response;
	} catch (error) {
		console.error("Error fetching Fukushima weeks:", error);
		return null;
	}
});

export const eventsAtomLoadable = loadable(eventsAtomAsync);
export const fukushimaWeeksAtomLoadable = loadable(fukushimaWeeksAtomAsync);
