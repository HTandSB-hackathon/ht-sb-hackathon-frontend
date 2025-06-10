import { createAxiosClient } from "@/lib/infrastructure/AxiosClient";

// 数値のgenderを文字列に変換する関数
function convertGenderFromNumber(
	genderNumber: number,
): "male" | "female" | "other" {
	switch (genderNumber) {
		case 0:
			return "male";
		case 1:
			return "female";
		case 2:
			return "other";
		default:
			return "other"; // デフォルト値
	}
}

export class Character {
	constructor(
		public id: number,
		public name: string,
		public age: number,
		public gender: "female" | "male" | "other",
		public occupationId: number,
		public profileImageUrl: string,
		public coverImageUrl: string,
		public introduction: string,
		public personality: string[],
		public hobbies: string[],
		public specialties: string[],
		public isActive: boolean,
		public unlockCondition: string,
		public prefectureId: number,
		public municipalityId: number,
		public createdDate: string,
		public updatedDate: string,
		public isLocked: boolean,
	) {}
}

export class Relationship {
	constructor(
		public id: number,
		public characterId: number,
		public trustLevelId: number,
		public trustPoints: number,
		public isFavorite: boolean,
		public nextLevelPoints: number,
		public firstMetAt: Date,
		public createdDate: Date,
		public updatedDate: Date,
	) {}
}

export class Story {
	constructor(
		public id: string,
		public characterId: number,
		public title: string,
		public content: string,
		public requiredTrustLevel: number,
		public isUnlocked: boolean,
		public createdDate: Date, // ISO 8601形式の文字列
		public updatedDate: Date, // ISO 8601形式の文字列
	) {}
}

export interface CharacterResponse {
	id: number;
	name: string;
	age: number;
	gender: number;
	occupation_id: number;
	profile_image_url: string;
	cover_image_url: string;
	introduction: string;
	unlock_condition: string;
	personality: string[];
	hobbies: string[];
	specialties: string[];
	is_active: boolean;
	is_locked: boolean;
	prefecture_id: number;
	municipality_id: number;
	created_date: string; // ISO 8601形式の文字列
	updated_date: string; // ISO 8601形式の文字列
}

export interface RelationshipResponse {
	id: number;
	character_id: number;
	trust_level_id: number;
	total_points: number;
	is_favorite: boolean;
	next_level_points: number;
	first_met_at: string; // ISO 8601形式の文字列
	created_date: string; // ISO 8601形式の文字列
	updated_date: string; // ISO 8601形式の文字列
}

export interface StoryResponse {
	id: string;
	character_id: number;
	title: string;
	content: string;
	required_trust_level: number;
	created_date: string; // ISO 8601形式の文字列
	updated_date: string; // ISO 8601形式の文字列
}

export interface RelationShipRequest {
	trust_level_id: number | null;
	total_points: number | null;
	is_favorite: boolean | null;
}

export interface NfcRequest {
	nfc_uuid: string;
}

export interface NFCUuidResponse {
	characterId: number;
	unlocked: boolean;
	message: string;
}

function createCharacter(res: CharacterResponse): Character {
	return new Character(
		res.id,
		res.name,
		res.age,
		convertGenderFromNumber(res.gender),
		res.occupation_id,
		res.profile_image_url,
		res.cover_image_url,
		res.introduction,
		res.personality,
		res.hobbies,
		res.specialties,
		res.is_active,
		res.unlock_condition,
		res.prefecture_id,
		res.municipality_id,
		res.created_date,
		res.updated_date,
		res.is_locked,
	);
}

function createRelationship(res: RelationshipResponse): Relationship {
	return new Relationship(
		res.id,
		res.character_id,
		res.trust_level_id,
		res.total_points,
		res.is_favorite,
		res.next_level_points,
		new Date(res.first_met_at),
		new Date(res.created_date),
		new Date(res.updated_date),
	);
}

function createStory(res: StoryResponse): Story {
	return new Story(
		res.id,
		res.character_id,
		res.title,
		res.content,
		res.required_trust_level,
		false,
		new Date(res.created_date),
		new Date(res.updated_date),
	);
}

export async function getCharacters(): Promise<Character[]> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.get<CharacterResponse[]>("/characters");
	return response.data.map(createCharacter);
}

export async function getLockedCharacters(): Promise<Character[]> {
	const axiosClient = createAxiosClient();
	const response =
		await axiosClient.get<CharacterResponse[]>("/characters/locked");
	return response.data.map(createCharacter);
}

export async function getRelationship(
	characterId: number,
): Promise<Relationship> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.get<RelationshipResponse>(
		`/characters/${characterId}`,
	);
	return createRelationship(response.data);
}

export async function getRelationships(): Promise<Relationship[]> {
	const axiosClient = createAxiosClient();
	const response =
		await axiosClient.get<RelationshipResponse[]>("/characters/all");
	return response.data.map(createRelationship);
}

export async function getStories(characterId: string): Promise<Story[]> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.get<StoryResponse[]>(
		`/characters/${characterId}/stories/unlocked`,
	);
	return response.data.map(createStory);
}

export async function getLockedStories(characterId: string): Promise<Story[]> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.get<StoryResponse[]>(
		`/characters/${characterId}/stories/locked`,
	);
	return response.data.map(createStory);
}

export async function insertRelationship(
	characterId: number,
): Promise<Relationship> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.post<
		Record<string, never>,
		RelationshipResponse
	>(`/characters/${characterId}/insert`, {});
	return createRelationship(response.data);
}

export async function updateRelationship(
	characterId: number,
	relationship: RelationShipRequest,
): Promise<Relationship> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.put<
		RelationShipRequest,
		RelationshipResponse
	>(`/characters/${characterId}/put`, relationship);
	return createRelationship(response.data);
}

export async function checkLevelUpRelationship(
	characterId: number,
): Promise<Relationship> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.put<
		Record<string, never>,
		RelationshipResponse
	>(`/characters/${characterId}/check_trust_level`, {});
	return createRelationship(response.data);
}

export async function checkStroyUnlock(characterId: number): Promise<Story> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.put<Record<string, never>, StoryResponse>(
		`/characters/${characterId}/stories/unlock`,
		{},
	);
	return createStory(response.data);
}

// NFC UUIDを送信してキャラクターの解放状況を確認する関数
export async function postNFCUuid(uuid: string): Promise<Relationship> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.post<NfcRequest, RelationshipResponse>(
		"/characters/nfc",
		{ nfc_uuid: uuid },
	);
	return createRelationship(response.data);
}
