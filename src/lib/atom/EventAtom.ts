import { atomWithRefresh, loadable } from "jotai/utils";

import { type Event, getEvents } from "../domain/EventQuery";

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

export const eventsAtomLoadable = loadable(eventsAtomAsync);
