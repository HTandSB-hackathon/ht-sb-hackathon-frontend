import { createAxiosClient } from "@/lib/infrastructure/AxiosClient";

export class Occupation {
	constructor(
		public id: number,
		public name: string,
		public createdDate: Date,
		public updatedDate: Date,
	) {}
}

interface OccupationResponse {
	id: number;
	name: string;
	created_date: string; // ISO 8601形式の文字列
	updated_date: string; // ISO 8601形式の文字列
}

function createOccupation(res: OccupationResponse): Occupation {
	return new Occupation(
		res.id,
		res.name,
		new Date(res.created_date),
		new Date(res.updated_date),
	);
}

export async function getOccupations(): Promise<Occupation[]> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.get<OccupationResponse[]>("/occupations");
	return response.data.map(createOccupation);
}
