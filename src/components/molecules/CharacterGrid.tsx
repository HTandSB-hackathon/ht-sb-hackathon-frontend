import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import type {
	Character,
	CharacterRelationship,
} from "../../lib/types/character";
import { CharacterCard } from "../atoms/CharacterCard";

interface CharacterGridProps {
	characters: Character[];
	relationships: Record<string, CharacterRelationship>;
	newCharacterIds?: Set<string>;
	onFavoriteToggle?: (characterId: string, isFavorite: boolean) => void;
	emptyMessage?: string;
	isLoading?: boolean;
}

/**
 * キャラクターグリッドコンポーネント
 * キャラクターカードをグリッドレイアウトで表示
 */
export const CharacterGrid: React.FC<CharacterGridProps> = ({
	characters,
	relationships,
	newCharacterIds = new Set(),
	onFavoriteToggle,
	emptyMessage = "キャラクターが見つかりません",
	isLoading = false,
}) => {
	// ローディング表示
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{Array.from({ length: 8 }).map((_, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: index * 0.1 }}
						className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
					>
						<div className="h-32 bg-gray-300" />
						<div className="p-6">
							<div className="w-24 h-24 mx-auto -mt-12 bg-gray-300 rounded-full" />
							<div className="mt-4 space-y-2">
								<div className="h-6 bg-gray-300 rounded mx-auto w-3/4" />
								<div className="h-4 bg-gray-300 rounded mx-auto w-1/2" />
							</div>
						</div>
					</motion.div>
				))}
			</div>
		);
	}

	// 空の状態
	if (characters.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col items-center justify-center py-16"
			>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ type: "spring", duration: 0.5 }}
					className="text-6xl mb-4"
				>
					😢
				</motion.div>
				<p className="text-gray-500 text-lg">{emptyMessage}</p>
			</motion.div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			<AnimatePresence mode="popLayout">
				{characters.map((character, index) => (
					<CharacterCard
						key={character.id}
						character={character}
						relationship={relationships[character.id]}
						isNew={newCharacterIds.has(character.id)}
						animationDelay={index * 0.1}
						onFavoriteToggle={onFavoriteToggle}
					/>
				))}
			</AnimatePresence>
		</div>
	);
};
