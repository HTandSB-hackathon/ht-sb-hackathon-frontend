import { atom } from "jotai";
import type {
	CharacterDetail,
	CharacterFilter,
	CharacterRelationship,
	CharacterSortBy,
} from "../types/character";

import { atomWithRefresh, loadable } from "jotai/utils";
import {
	type Character,
	type RelationShipRequest,
	type Relationship,
	type Story,
	checkLevelUpRelationship,
	checkStroyUnlock,
	getCharacters,
	getLockedCharacters,
	getRelationships,
	insertRelationship,
	updateRelationship,
} from "../domain/CharacterQuery";
import type { Municipality } from "../domain/CityQuery";
import {
	isLevelUpModalOpenAtom,
	isNewCharacterModalOpenAtom,
	isNewStoryModalOpenAtom,
} from "./BaseAtom";
import { municipalityAtomAsync } from "./CityAtom";

/**
 * キャラクター一覧の状態
 */
export const charactersAtom = atom<Character[]>([]);
export const characterAtomAsync = atomWithRefresh<Promise<Character[]>>(
	async () => {
		try {
			const response = await getCharacters();
			return response;
		} catch (error) {
			console.error("Error fetching municipalities:", error);
			return [];
		}
	},
);

const lockedCharactersAtomAsync = atomWithRefresh<Promise<Character[]>>(
	async () => {
		try {
			const response = await getLockedCharacters();
			return response;
		} catch (error) {
			console.error("Error fetching municipalities:", error);
			return [];
		}
	},
);

export const relationshipsAtomAsync = atomWithRefresh<Promise<Relationship[]>>(
	async () => {
		try {
			const response = await getRelationships();
			return response;
		} catch (error) {
			console.error("Error fetching relationships:", error);
			return [];
		}
	},
);

export const favoriteCharacterIdsAtom = atom(async (get) => {
	const relationships = await get(relationshipsAtomAsync);
	return new Set(
		relationships
			.filter((relationship) => relationship.isFavorite)
			.map((relationship) => relationship.characterId),
	);
});

interface characterTrustLevelTop3 {
	relationship: Relationship;
	character: Character | null;
	municipality: Municipality | null;
}

export const characterTrustLevelTop3Atom = atom<
	Promise<characterTrustLevelTop3[]>
>(async (get) => {
	const characters = await get(characterAtomAsync);
	const relationships = await get(relationshipsAtomAsync);
	const municipalities = await get(municipalityAtomAsync);

	const top3Relationships = relationships
		.sort((a, b) => {
			return b.trustPoints - a.trustPoints;
		})
		.slice(0, 3);
	return top3Relationships.map((relationship) => {
		const character = characters.find(
			(char) => char.id === relationship.characterId,
		);
		const municipality = municipalities.find(
			(muni) => muni.id === character?.municipalityId,
		);

		return {
			relationship: relationship,
			character: character || null,
			municipality: municipality || null,
		};
	});
});

export const charactersAtomLoadable = loadable(characterAtomAsync);
export const lockedCharactersAtomLoadable = loadable(lockedCharactersAtomAsync);
export const relationshipsAtomLoadable = loadable(relationshipsAtomAsync);

export const updateRelationshipAtom = atom(
	null,
	async (
		_,
		set,
		{
			characterId,
			isFavorite = null,
			trustPoints = null,
			trustLevelId = null,
		}: {
			characterId: number;
			isFavorite?: boolean | null;
			trustPoints?: number | null;
			trustLevelId?: number | null;
		},
	) => {
		try {
			const relationship: RelationShipRequest = {
				is_favorite: isFavorite,
				total_points: trustPoints,
				trust_level_id: trustLevelId,
			};
			const response = await updateRelationship(characterId, relationship);
			// 更新後の関係性を取得して更新
			set(relationshipsAtomAsync);
			return response;
		} catch (error) {
			console.error("Error updating relationship:", error);
			throw error;
		}
	},
);

export const filteredCharactersAtom = atom(async (get) => {
	const unlockedcharacters = await get(characterAtomAsync);
	const lockedCharacters = await get(lockedCharactersAtomAsync);
	const characters = [...unlockedcharacters, ...lockedCharacters];

	const filter = get(characterFilterAtom);
	const relationships = await get(relationshipsAtomAsync);
	return characters.filter((character) => {
		if (
			filter.municipalityId &&
			character.municipalityId !== filter.municipalityId
		) {
			return false;
		}
		if (filter.gender && character.gender !== filter.gender) {
			return false;
		}
		if (
			filter.isLocked !== undefined &&
			character.isLocked !== filter.isLocked
		) {
			return false;
		}
		const relationship = relationships.find(
			(rel) => rel.characterId === character.id,
		);
		if (filter.trustLevel && relationship?.trustLevelId !== filter.trustLevel) {
			return false;
		}
		return true;
	});
});

export const sortedCharactersAtom = atom(async (get) => {
	const characters = await get(filteredCharactersAtom);
	const sortBy = get(characterSortByAtom);
	const relationships = await get(relationshipsAtomAsync);

	return [...characters].sort((a, b) => {
		switch (sortBy) {
			case "trustLevel": {
				const relA = relationships.find((rel) => rel.characterId === a.id);
				const relB = relationships.find((rel) => rel.characterId === b.id);
				return (relB?.trustLevelId || 0) - (relA?.trustLevelId || 0);
			}
			case "name":
				return a.name.localeCompare(b.name, "ja");
			default:
				return 0;
		}
	});
});

export const newCharacterRelationshipAtom = atom<Relationship | null>(null);
export const getNewCharacterAtom = atom(
	null,
	async (get, set, characterId: number) => {
		try {
			const newRelationship = await insertRelationship(characterId);
			const relationships = await get(relationshipsAtomAsync);

			// relationshipsにnewRelationshipのIDを持つ要素が存在するか確認
			const existingRelationship = relationships.find(
				(relationship) => relationship.id === newRelationship.id,
			);
			// 存在しない場合のみ新しい関係性を設定
			if (!existingRelationship) {
				set(newCharacterRelationshipAtom, newRelationship);
				set(isNewCharacterModalOpenAtom, true);
			}
			return newRelationship;
		} catch (error) {
			console.error("Error inserting new character:", error);
			throw error;
		} finally {
			set(relationshipsAtomAsync);
			set(characterAtomAsync);
			set(lockedCharactersAtomAsync);
			set(municipalityAtomAsync);
		}
	},
);

interface levelUpCharacterDetail {
	character?: Character | null;
	relationship?: Relationship | null;
}

export const levelUpCharacterDetailAtom = atom<levelUpCharacterDetail | null>(
	null,
);
export const newStoryAtom = atom<Story | null>(null);
export const checkLevelUpRelationshipAtom = atom(
	null,
	async (get, set, characterId: number, curretntTrustLevelId: number) => {
		try {
			const relationship = await checkLevelUpRelationship(characterId);
			if (relationship.trustLevelId > curretntTrustLevelId) {
				const characters = await get(characterAtomAsync);
				const character = characters.find((c) => c.id === characterId);
				set(levelUpCharacterDetailAtom, {
					character: character,
					relationship: relationship,
				});
				set(characterAtomAsync);
				set(lockedCharactersAtomAsync);
				set(relationshipsAtomAsync);

				const newStory = await checkStroyUnlock(characterId);
				if (newStory.requiredTrustLevel === relationship.trustLevelId) {
					// 新しいストーリーが解放された場合の処理
					console.log("新しいストーリーが解放されました:", newStory);
					set(isNewStoryModalOpenAtom, true);
					set(newStoryAtom, newStory);
				}
				// ストーリー解放モーダルよりも上にレベルアップモーダルを表示するため、後から状態を更新する
				set(isLevelUpModalOpenAtom, true);
			}
			return relationship;
		} catch (error) {
			console.error("Error checking level up relationship:", error);
			set(isLevelUpModalOpenAtom, false);
			set(levelUpCharacterDetailAtom, null);
			throw error;
		} finally {
		}
	},
);

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
