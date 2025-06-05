import { createAxiosClient } from "../infrastructure/AxiosClient";

export class Achivement {
	constructor(
		public id: number,
		public name: string,
		public description: string,
		public iconImageUrl: string,
	) {}
}

interface AchivementResponse {
	id: number;
	name: string;
	description: string;
	icon_image_url: string;
}

function createAchivement(res: AchivementResponse): Achivement {
	return new Achivement(res.id, res.name, res.description, res.icon_image_url);
}

export async function fetchUnlockedAchivements(): Promise<Achivement[]> {
	const client = createAxiosClient();
	const response = await client.get<AchivementResponse[]>(
		"/achivements/unlocked",
	);
	return response.data.map(createAchivement);
}

export async function fetchLockedAchivements(): Promise<Achivement[]> {
	const client = createAxiosClient();
	const response = await client.get<AchivementResponse[]>(
		"/achivements/locked",
	);
	return response.data.map(createAchivement);
}
