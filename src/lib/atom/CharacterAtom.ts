import { atom } from "jotai";
import type {
	CharacterDetail,
	CharacterFilter,
	CharacterRelationship,
	CharacterSortBy,
} from "../types/character";

import { loadable } from "jotai/utils";
import { type Character, getCharacters } from "../domain/CharacterQuery";

/**
 * キャラクター一覧の状態
 */
export const charactersAtom = atom<Character[]>([]);
export const characterAtomAsync = atom<Promise<Character[]>>(async () => {
	try {
		const response = await getCharacters();
		return response;
	} catch (error) {
		console.error("Error fetching municipalities:", error);
		return [];
	}
});

export const charactersAtomLoadable = loadable(characterAtomAsync);

/**
 * キャラクターとの関係性マップ
 */
export const characterRelationshipsAtom = atom<
	Record<string, CharacterRelationship>
>({});

/**
 * 選択中のキャラクター詳細
 */
export const selectedCharacterDetailAtom = atom<CharacterDetail | null>(null);

/**
 * キャラクター一覧の総数
 */
export const charactersTotalAtom = atom<number>(0);

/**
 * 現在のページ番号
 */
export const charactersPageAtom = atom<number>(1);

/**
 * フィルター設定
 */
export const characterFilterAtom = atom<CharacterFilter>({});

/**
 * ソート設定
 */
export const characterSortByAtom = atom<CharacterSortBy>("trustLevel");

/**
 * お気に入りキャラクターのIDセット
 */
export const favoriteCharacterIdsAtom = atom<Set<string>>(new Set([]));

/**
 * ローディング状態
 */
export const charactersLoadingAtom = atom<boolean>(false);

/**
 * エラー状態
 */
export const charactersErrorAtom = atom<string | null>(null);

/**
 * キャラクター詳細のローディング状態
 */
export const characterDetailLoadingAtom = atom<boolean>(false);

/**
 * 最近会話したキャラクターのID（順序保持）
 */
export const recentConversationCharacterIdsAtom = atom<string[]>([]);

/**
 * 新しく解放されたキャラクターのID
 */
export const newlyUnlockedCharacterIdsAtom = atom<Set<string>>(new Set([]));

/**
 * アニメーション中のキャラクターID
 */
export const animatingCharacterIdAtom = atom<string | null>(null);

// 派生Atom

/**
 * フィルター済みキャラクター一覧
 */
// export const filteredCharactersAtom = atom((get) => {
// 	const characters = get(charactersAtom);
// 	const filter = get(characterFilterAtom);
// 	const relationships = get(characterRelationshipsAtom);

// 	return characters.filter((character) => {
// 		// 都市フィルター
// 		if (filter.city && character.municipalityId !== filter.city) {
// 			return false;
// 		}

// 		// 性別フィルター
// 		if (filter.gender && character.gender !== filter.gender) {
// 			return false;
// 		}

// 		// ロック状態フィルター
// 		if (
// 			filter.isLocked !== undefined &&
// 			character.isLocked !== filter.isLocked
// 		) {
// 			return false;
// 		}

// 		// 信頼レベルフィルター
// 		if (filter.trustLevel) {
// 			const relationship = relationships[character.id];
// 			if (!relationship || relationship.trustLevel !== filter.trustLevel) {
// 				return false;
// 			}
// 		}

// 		return true;
// 	});
// });

/**
 * ソート済みキャラクター一覧
 */
// export const sortedCharactersAtom = atom((get) => {
// 	const characters = get(filteredCharactersAtom);
// 	const sortBy = get(characterSortByAtom);
// 	const relationships = get(characterRelationshipsAtom);

// 	return [...characters].sort((a, b) => {
// 		switch (sortBy) {
// 			case "trustLevel": {
// 				const relA = relationships[a.id];
// 				const relB = relationships[b.id];
// 				return (relB?.trustLevel || 0) - (relA?.trustLevel || 0);
// 			}
// 			case "lastConversation": {
// 				const relA = relationships[a.id];
// 				const relB = relationships[b.id];
// 				const dateA = relA?.lastConversationAt
// 					? new Date(relA.lastConversationAt).getTime()
// 					: 0;
// 				const dateB = relB?.lastConversationAt
// 					? new Date(relB.lastConversationAt).getTime()
// 					: 0;
// 				return dateB - dateA;
// 			}
// 			case "name":
// 				return a.nameKana.localeCompare(b.nameKana, "ja");
// 			case "city":
// 				return a.city.localeCompare(b.city, "ja");
// 			default:
// 				return 0;
// 		}
// 	});
// });

/**
 * お気に入りキャラクター一覧
 */
export const favoriteCharactersAtom = atom((get) => {
	const characters = get(charactersAtom);
	const favoriteIds = get(favoriteCharacterIdsAtom);
	return characters.filter((character) => favoriteIds?.has(character.id));
});

/**
 * 信頼レベル別のキャラクター数
 */
export const characterCountByTrustLevelAtom = atom((get) => {
	const characters = get(charactersAtom);
	const relationships = get(characterRelationshipsAtom);

	const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

	for (const character of characters) {
		const relationship = relationships[character.id];
		if (relationship) {
			counts[relationship.trustLevel] =
				(counts[relationship.trustLevel] || 0) + 1;
		}
	}

	return counts;
});
