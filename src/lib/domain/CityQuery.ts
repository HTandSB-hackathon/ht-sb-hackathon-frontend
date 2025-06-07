import { createAxiosClient } from "@/lib/infrastructure/AxiosClient";

export class Municipality {
	constructor(
		public id: number,
		public name: string,
		public kana: string,
		public prefectureId: number,
		public color: string,
		public emoji: string,
		public gradient: string,
		public specialty: string,
		public createdDate: Date,
		public updatedDate: Date | null,
	) {}
}

export interface MunicipalityFascinatingDetail {
	emoji: string;
	title: string;
	content: string;
}

export class MunicipalityFascinating {
	constructor(
		public prefectureId: number,
		public municipalityId: number,
		public content: string,
		public color: string,
		public emoji: string,
		public gradient: string,
		public details: MunicipalityFascinatingDetail[],
		public createdDate: Date,
		public updatedDate: Date,
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

export interface MunicipalityFascinatingResponse {
	prefecture_id: number;
	municipality_id: number;
	content: string;
	color: string;
	emoji: string;
	gradient: string;
	details: MunicipalityFascinatingDetail[];
	created_date: string;
	updated_date: string;
}

function createMunicipality(res: MunicipalityResponse): Municipality {
	return new Municipality(
		res.id,
		res.name,
		res.kana,
		res.prefecture_id,
		"green",
		"🏙️",
		"linear(to-r, green.400, teal.400)",
		"都市の特産品",
		new Date(res.created_date),
		res.updated_date ? new Date(res.updated_date) : null,
	);
}

function createMunicipalityFascinating(
	res: MunicipalityFascinatingResponse,
): MunicipalityFascinating {
	return new MunicipalityFascinating(
		res.prefecture_id,
		res.municipality_id,
		res.content,
		res.color,
		res.emoji,
		res.gradient,
		res.details,
		new Date(res.created_date),
		new Date(res.updated_date),
	);
}

export async function getMunicipalities({
	prefecture_id,
}: { prefecture_id: number }): Promise<Municipality[]> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.get<MunicipalityResponse[]>(
		`/cities/prefectures/${prefecture_id}/relationships`,
	);
	return response.data.map(createMunicipality);
}

export async function getMunicipalityFascinating({
	prefecture_id,
}: { prefecture_id: number }): Promise<MunicipalityFascinating[]> {
	const axiosClient = createAxiosClient();
	try {
		const response = await axiosClient.get<MunicipalityFascinatingResponse[]>(
			`/cities/prefectures/${prefecture_id}/fascination`,
		);
		return response.data.map(createMunicipalityFascinating);
	} catch (error) {
		console.error("Failed to fetch municipality fascinating data:", error);
		return [];
	}
}
