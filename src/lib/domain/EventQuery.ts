import { createAxiosClient } from "@/lib/infrastructure/AxiosClient";

export class Event {
	constructor(
		public id: number,
		public title: string,
		public description: string,
		public timestamp: Date,
	) {}
}

export interface FukushimaWeek {
	id: number;
	date: string;
	title: string;
	municipality: string;
	url: string;
}

export interface EventResponse {
	id: number;
	title: string;
	details: string;
	timestamp: string; // ISO 8601形式の文字列
}

export interface FukushimaWeekResponse {
	id: number;
	date: string;
	title: string;
	municipality: string;
	url: string;
}

function createEvent(res: EventResponse): Event {
	return new Event(res.id, res.title, res.details, new Date(res.timestamp));
}

function createFukushimaWeek(res: FukushimaWeekResponse): FukushimaWeek {
	return {
		id: res.id,
		date: res.date,
		title: res.title,
		municipality: res.municipality,
		url: res.url,
	};
}

export async function getEvents(): Promise<Event[]> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.get<EventResponse[]>("/events");
	return response.data.map(createEvent);
}

export async function getFukushimaWeeks(): Promise<FukushimaWeek[]> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.get<FukushimaWeekResponse[]>(
		"/events/fukushima-weeks",
	);
	return response.data.map(createFukushimaWeek);
}
