import { createAxiosClient } from "@/lib/infrastructure/AxiosClient";

import type {
	// CharacterDetail,
	// CharacterListParams,
	CharacterRelationship,
} from "../types/character";

// モックデータ
// const MOCK_CHARACTERS: Character[] = [
// 	{
// 		id: "1",
// 		name: "佐藤 花子",
// 		nameKana: "サトウ ハナコ",
// 		age: 58,
// 		gender: "female",
// 		occupation: "農家",
// 		city: "須賀川市",
// 		prefecture: "福島県",
// 		profileImage:
// 			"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
// 		coverImage:
// 			"https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=400&fit=crop",
// 		introduction:
// 			"須賀川でキュウリとお米を作っています。毎日畑で汗を流していますが、それが私の生きがいです。新鮮な野菜の美味しさを、もっと多くの人に知ってもらいたいです。",
// 		personality: ["優しい", "世話好き", "明るい", "頑張り屋"],
// 		hobbies: ["家庭菜園", "料理", "手芸", "散歩"],
// 		specialties: ["きゅうりの漬物", "おふくろの味", "野菜作り"],
// 		isLocked: false,
// 		createdAt: "2024-01-01T00:00:00Z",
// 		updatedAt: "2024-01-01T00:00:00Z",
// 	},
// 	{
// 		id: "2",
// 		name: "田中 一郎",
// 		nameKana: "タナカ イチロウ",
// 		age: 65,
// 		gender: "male",
// 		occupation: "元教師",
// 		city: "三春町",
// 		prefecture: "福島県",
// 		profileImage:
// 			"https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop",
// 		coverImage:
// 			"https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=400&fit=crop",
// 		introduction:
// 			"三春町で40年間、小学校の教師をしていました。今は地域の子どもたちに昔の遊びを教えています。三春の滝桜は日本一美しいと思っています。",
// 		personality: ["温厚", "知識豊富", "子ども好き", "歴史好き"],
// 		hobbies: ["読書", "将棋", "ガーデニング", "歴史散策"],
// 		specialties: ["郷土史", "子ども教育", "将棋指導"],
// 		isLocked: false,
// 		createdAt: "2024-01-02T00:00:00Z",
// 		updatedAt: "2024-01-02T00:00:00Z",
// 	},
// 	{
// 		id: "3",
// 		name: "鈴木 美咲",
// 		nameKana: "スズキ ミサキ",
// 		age: 45,
// 		gender: "female",
// 		occupation: "カフェ経営",
// 		city: "中島村",
// 		prefecture: "福島県",
// 		profileImage:
// 			"https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop",
// 		coverImage:
// 			"https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=400&fit=crop",
// 		introduction:
// 			"中島村で小さなカフェを営んでいます。地元の食材を使った料理と、温かいおもてなしが自慢です。村の魅力を一人でも多くの人に伝えたいです。",
// 		personality: ["社交的", "創造的", "前向き", "地域愛"],
// 		hobbies: ["料理研究", "写真撮影", "ヨガ", "読書"],
// 		specialties: ["地産地消料理", "コーヒー", "接客"],
// 		isLocked: false,
// 		createdAt: "2024-01-03T00:00:00Z",
// 		updatedAt: "2024-01-03T00:00:00Z",
// 	},
// 	{
// 		id: "4",
// 		name: "高橋 太郎",
// 		nameKana: "タカハシ タロウ",
// 		age: 52,
// 		gender: "male",
// 		occupation: "果樹園経営",
// 		city: "須賀川市",
// 		prefecture: "福島県",
// 		profileImage:
// 			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
// 		coverImage:
// 			"https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=400&fit=crop",
// 		introduction:
// 			"須賀川で桃とりんごの果樹園を営んでいます。祖父の代から続く果樹園を守りながら、新しい品種にも挑戦しています。",
// 		personality: ["真面目", "研究熱心", "伝統重視", "革新的"],
// 		hobbies: ["果樹研究", "料理", "写真", "ドライブ"],
// 		specialties: ["果樹栽培", "品種改良", "ジャム作り"],
// 		isLocked: true,
// 		unlockCondition: "信頼レベル3以上のキャラクターが2人必要",
// 		createdAt: "2024-01-04T00:00:00Z",
// 		updatedAt: "2024-01-04T00:00:00Z",
// 	},
// 	{
// 		id: "5",
// 		name: "渡辺 京子",
// 		nameKana: "ワタナベ キョウコ",
// 		age: 70,
// 		gender: "female",
// 		occupation: "民宿経営",
// 		city: "三春町",
// 		prefecture: "福島県",
// 		profileImage:
// 			"https://images.unsplash.com/photo-1441123100240-f9f3f77ed41b?w=400&h=400&fit=crop",
// 		coverImage:
// 			"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=400&fit=crop",
// 		introduction:
// 			"三春町で民宿を営んで30年。全国から来るお客様に、福島の温かさを感じてもらえるよう心を込めておもてなししています。",
// 		personality: ["温かい", "包容力", "経験豊富", "もてなし上手"],
// 		hobbies: ["郷土料理", "生け花", "着物", "お茶"],
// 		specialties: ["おもてなし", "郷土料理", "地域案内"],
// 		isLocked: true,
// 		unlockCondition: "田中一郎さんと親友になる",
// 		createdAt: "2024-01-05T00:00:00Z",
// 		updatedAt: "2024-01-05T00:00:00Z",
// 	},
// ];

// const MOCK_RELATIONSHIPS: Record<string, CharacterRelationship> = {
// 	"1": {
// 		characterId: "1",
// 		trustLevel: 3,
// 		trustPoints: 75,
// 		nextLevelPoints: 100,
// 		totalConversations: 15,
// 		lastConversationAt: new Date(
// 			Date.now() - 2 * 24 * 60 * 60 * 1000,
// 		).toISOString(),
// 		firstMetAt: "2024-01-01T00:00:00Z",
// 		favoriteTopics: ["農業", "料理", "地域活動"],
// 		unlockedStories: ["story1", "story2"],
// 		receivedGifts: [],
// 	},
// 	"2": {
// 		characterId: "2",
// 		trustLevel: 2,
// 		trustPoints: 30,
// 		nextLevelPoints: 50,
// 		totalConversations: 8,
// 		lastConversationAt: new Date(
// 			Date.now() - 7 * 24 * 60 * 60 * 1000,
// 		).toISOString(),
// 		firstMetAt: "2024-01-15T00:00:00Z",
// 		favoriteTopics: ["歴史", "教育", "三春町"],
// 		unlockedStories: ["story1"],
// 		receivedGifts: [],
// 	},
// 	"3": {
// 		characterId: "3",
// 		trustLevel: 4,
// 		trustPoints: 45,
// 		nextLevelPoints: 75,
// 		totalConversations: 25,
// 		lastConversationAt: new Date().toISOString(),
// 		firstMetAt: "2024-01-10T00:00:00Z",
// 		favoriteTopics: ["カフェ", "地域活性化", "料理"],
// 		unlockedStories: ["story1", "story2", "story3"],
// 		receivedGifts: [],
// 	},
// };

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
		public id: string,
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
		public prefectureId: number,
		public municipalityId: number,
		public createdDate: string,
		public updatedDate: string,
		public isLocked: boolean,
	) {}
}

export interface CharacterResponse {
	id: string;
	name: string;
	age: number;
	gender: number;
	occupation_id: number;
	profile_image_url: string;
	cover_image_url: string;
	introduction: string;
	personality: string[];
	hobbies: string[];
	specialties: string[];
	is_active: boolean;
	prefecture_id: number;
	municipality_id: number;
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
		res.prefecture_id,
		res.municipality_id,
		res.created_date,
		res.updated_date,
		false,
	);
}

export async function getCharacters(): Promise<Character[]> {
	const axiosClient = createAxiosClient();
	const response = await axiosClient.get<CharacterResponse[]>("/characters");
	return response.data.map(createCharacter);
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
