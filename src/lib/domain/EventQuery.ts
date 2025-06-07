import { createAxiosClient } from "@/lib/infrastructure/AxiosClient";

export class Event {
	constructor(
		public id: number,
		public title: string,
		public description: string,
		public timestamp: Date,
	) {}
}

export interface EventResponse {
	id: number;
	title: string;
	details: string;
	timestamp: string; // ISO 8601形式の文字列
}

function createEvent(res: EventResponse): Event {
	return new Event(res.id, res.title, res.details, new Date(res.timestamp));
}

export async function getEvents(): Promise<Event[]> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.get<EventResponse[]>("/events");
	return response.data.map(createEvent);
}
