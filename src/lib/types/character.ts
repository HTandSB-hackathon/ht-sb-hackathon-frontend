/**
 * キャラクター関連の型定義
 */

/**
 * 信頼レベル
 */
export const TRUST_LEVELS = {
	1: {
		name: "初対面",
		color: "gray",
		bgColor: "bg-gray-100",
		borderColor: "border-gray-300",
	},
	2: {
		name: "顔見知り",
		color: "green",
		bgColor: "bg-green-100",
		borderColor: "border-green-300",
	},
	3: {
		name: "友達",
		color: "blue",
		bgColor: "bg-blue-100",
		borderColor: "border-blue-300",
	},
	4: {
		name: "親友",
		color: "purple",
		bgColor: "bg-purple-100",
		borderColor: "border-purple-300",
	},
	5: {
		name: "家族同然",
		color: "yellow",
		bgColor: "bg-yellow-100",
		borderColor: "border-yellow-300",
	},
} as const;

export type TrustLevel = keyof typeof TRUST_LEVELS;

/**
 * キャラクターの基本情報
 */
export interface Character {
	id: string;
	name: string;
	nameKana: string;
	age: number;
	gender: "male" | "female";
	occupation: string;
	city: string;
	prefecture: string;
	profileImage: string;
	coverImage?: string;
	introduction: string;
	personality: string[];
	hobbies: string[];
	specialties: string[];
	isLocked: boolean;
	unlockCondition?: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * キャラクターとの関係性情報
 */
export interface CharacterRelationship {
	characterId: string;
	trustLevel: TrustLevel;
	trustPoints: number;
	nextLevelPoints: number;
	totalConversations: number;
	lastConversationAt: string | null;
	firstMetAt: string;
	favoriteTopics: string[];
	unlockedStories: string[];
	receivedGifts: Gift[];
}

/**
 * 贈り物情報
 */
export interface Gift {
	id: string;
	name: string;
	description: string;
	imageUrl: string;
	receivedAt: string;
	category: "food" | "craft" | "souvenir";
}

/**
 * キャラクターの詳細情報（API レスポンス用）
 */
export interface CharacterDetail extends Character {
	relationship: CharacterRelationship;
	stories: CharacterStory[];
	voiceMessages: VoiceMessage[];
	localSpecialties: LocalSpecialty[];
}

/**
 * キャラクターのストーリー
 */
export interface CharacterStory {
	id: string;
	title: string;
	content: string;
	requiredTrustLevel: TrustLevel;
	isUnlocked: boolean;
	unlockedAt?: string;
}

/**
 * ボイスメッセージ
 */
export interface VoiceMessage {
	id: string;
	message: string;
	audioUrl: string;
	duration: number;
	requiredTrustLevel: TrustLevel;
	isUnlocked: boolean;
}

/**
 * 地域の特産品
 */
export interface LocalSpecialty {
	id: string;
	name: string;
	description: string;
	imageUrl: string;
	season?: string;
	availableAsGift: boolean;
}

/**
 * キャラクター一覧のフィルター
 */
export interface CharacterFilter {
	city?: number;
	trustLevel?: TrustLevel;
	isLocked?: boolean;
	gender?: "male" | "female";
}

/**
 * キャラクター一覧のソート
 */
export type CharacterSortBy =
	| "trustLevel"
	| "lastConversation"
	| "name"
	| "city";

export interface CharacterListParams {
	filter?: CharacterFilter;
	sortBy?: CharacterSortBy;
	page?: number;
	limit?: number;
}
