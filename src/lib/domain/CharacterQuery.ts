import { createAxiosClient } from "@/lib/infrastructure/AxiosClient";

import type {
	// CharacterDetail,
	// CharacterListParams,
	CharacterRelationship,
} from "../types/character";

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
		public characterId: string,
		public trustLevelId: number,
		public trustPoints: number,
		public conversationCount: number,
		public firstMetAt: Date,
		public createdDate: Date,
		public updatedDate: Date,
	) {}
}

export class Story {
	constructor(
		public id: string,
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
	character_id: string;
	trust_level_id: number;
	trust_points: number;
	conversation_count: number;
	first_met_at: string; // ISO 8601形式の文字列
	created_date: string; // ISO 8601形式の文字列
	updated_date: string; // ISO 8601形式の文字列
}

export interface StoryResponse {
	id: string;
	title: string;
	content: string;
	required_trust_level: number;
	created_date: string; // ISO 8601形式の文字列
	updated_date: string; // ISO 8601形式の文字列
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
		res.trust_points,
		res.conversation_count,
		new Date(res.first_met_at),
		new Date(res.created_date),
		new Date(res.updated_date),
	);
}

function createStory(res: StoryResponse): Story {
	return new Story(
		res.id,
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

export async function getRelationships(
	characterId: string,
): Promise<Relationship> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.get<RelationshipResponse>(
		`/characters/${characterId}`,
	);
	return createRelationship(response.data);
}

export async function getStories(characterId: string): Promise<Story[]> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.get<StoryResponse[]>(
		`/characters/${characterId}/stories`,
	);
	return response.data.map(createStory);
}

/**
 * キャラクター関連のAPIクエリ（モック版）
 */
export class CharacterQuery {
	/**
	 * キャラクター一覧を取得
	 */
	// static async getCharacters(params?: CharacterListParams): Promise<{
	// 	characters: Character[];
	// 	relationships: Record<string, CharacterRelationship>;
	// 	total: number;
	// }> {
	// 	// モック遅延
	// 	await new Promise((resolve) => setTimeout(resolve, 500));
	// 	console.log(params);
	// 	return {
	// 		characters: MOCK_CHARACTERS,
	// 		relationships: MOCK_RELATIONSHIPS,
	// 		total: MOCK_CHARACTERS.length,
	// 	};
	// }

	/**
	 * キャラクター詳細を取得
	 */
	// static async getCharacterDetail(
	// 	characterId: string,
	// ): Promise<CharacterDetail> {
	// 	// モック遅延
	// 	await new Promise((resolve) => setTimeout(resolve, 300));

	// 	const character = MOCK_CHARACTERS.find((c) => c.id === characterId);
	// 	if (!character) {
	// 		throw new Error("Character not found");
	// 	}

	// 	const detail: CharacterDetail = {
	// 		...character,
	// 		relationship: MOCK_RELATIONSHIPS[characterId] || {
	// 			characterId,
	// 			trustLevel: 1,
	// 			trustPoints: 0,
	// 			nextLevelPoints: 25,
	// 			totalConversations: 0,
	// 			lastConversationAt: null,
	// 			firstMetAt: new Date().toISOString(),
	// 			favoriteTopics: [],
	// 			unlockedStories: [],
	// 			receivedGifts: [],
	// 		},
	// 		stories: [
	// 			{
	// 				id: "story1",
	// 				title: "初めての出会い",
	// 				content: "初めて会った時のことを今でも覚えています。あの日は...",
	// 				requiredTrustLevel: 1,
	// 				isUnlocked: true,
	// 				unlockedAt: "2024-01-01T00:00:00Z",
	// 			},
	// 			{
	// 				id: "story2",
	// 				title: "私の大切な思い出",
	// 				content: "実は、この仕事を始めたきっかけは...",
	// 				requiredTrustLevel: 2,
	// 				isUnlocked: character.id === "1" || character.id === "3",
	// 				unlockedAt:
	// 					character.id === "1" || character.id === "3"
	// 						? "2024-01-15T00:00:00Z"
	// 						: undefined,
	// 			},
	// 			{
	// 				id: "story3",
	// 				title: "あなたに伝えたいこと",
	// 				content: "今まで言えなかったけど、実は...",
	// 				requiredTrustLevel: 4,
	// 				isUnlocked: character.id === "3",
	// 				unlockedAt: character.id === "3" ? "2024-02-01T00:00:00Z" : undefined,
	// 			},
	// 		],
	// 		voiceMessages: [],
	// 		localSpecialties: [
	// 			{
	// 				id: "sp1",
	// 				name:
	// 					character.city === "須賀川市"
	// 						? "きゅうり"
	// 						: character.city === "三春町"
	// 							? "三春そうめん"
	// 							: "トマト",
	// 				description: "地元の特産品です",
	// 				imageUrl:
	// 					"https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=200&h=200&fit=crop",
	// 				season: "夏",
	// 				availableAsGift: true,
	// 			},
	// 		],
	// 	};

	// 	return detail;
	// }

	/**
	 * お気に入りのキャラクターを取得
	 */
	// static async getFavoriteCharacters(): Promise<Character[]> {
	// 	await new Promise((resolve) => setTimeout(resolve, 200));
	// 	return [MOCK_CHARACTERS[0], MOCK_CHARACTERS[2]];
	// }

	/**
	 * キャラクターをお気に入りに追加/削除
	 */
	static async toggleFavorite(
		characterId: string,
		isFavorite: boolean,
	): Promise<{ success: boolean }> {
		await new Promise((resolve) => setTimeout(resolve, 200));
		console.log(`Character ${characterId} favorite: ${isFavorite}`);
		return { success: true };
	}

	// 以下の関数は実装なし（モック版では必要最小限のみ）
	static async updateRelationship(): Promise<CharacterRelationship> {
		throw new Error("Not implemented in mock version");
	}

	static async unlockCharacter(): Promise<Character> {
		throw new Error("Not implemented in mock version");
	}

	static async unlockStory(): Promise<{ success: boolean }> {
		throw new Error("Not implemented in mock version");
	}
}
