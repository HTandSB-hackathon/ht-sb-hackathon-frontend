import { createAxiosClient } from "@/lib/infrastructure/AxiosClient";

export class Municipality {
	constructor(
		public id: number,
		public name: string,
		public kana: string,
		public prefectureId: number,
		public createdDate: Date,
		public updatedDate: Date | null,
	) {}
}

export interface MunicipalityResponse {
	id: number;
	name: string;
	kana: string;
	prefecture_id: number;
	created_date: string; // ISO 8601形式の文字列
	updated_date: string | null; // ISO 8601形式の文字列またはnull
}

function createMunicipality(res: MunicipalityResponse): Municipality {
	return new Municipality(
		res.id,
		res.name,
		res.kana,
		res.prefecture_id,
		new Date(res.created_date),
		res.updated_date ? new Date(res.updated_date) : null,
	);
}

export async function getMunicipalities({
	prefecture_id,
}: { prefecture_id: number }): Promise<Municipality[]> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.get<MunicipalityResponse[]>(
		`/cities/prefectures/${prefecture_id}`,
	);
	return response.data.map(createMunicipality);
}
