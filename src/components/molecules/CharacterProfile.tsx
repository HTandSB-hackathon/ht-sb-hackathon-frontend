import { motion } from "framer-motion";
import React from "react";
import type { CharacterDetail } from "../../lib/types/character";
import { CharacterAvatar } from "../atoms/CharacterAvatar";
import { TrustLevelBadge } from "../atoms/TrustLevelBadge";

interface CharacterProfileProps {
	character: CharacterDetail;
	onStartConversation: () => void;
}

/**
 * キャラクタープロファイルコンポーネント
 * キャラクター詳細画面のプロファイル表示部分
 */
export const CharacterProfile: React.FC<CharacterProfileProps> = ({
	character,
	onStartConversation,
}) => {
	const [activeTab, setActiveTab] = React.useState<"profile" | "stories" | "gifts">("profile");

	// 贈り物のカテゴリー別集計
	const giftsByCategory = React.useMemo(() => {
		const counts = { food: 0, craft: 0, souvenir: 0 };
		for (const gift of character.relationship.receivedGifts) {
			counts[gift.category]++;
		}
		return counts;
	}, [character.relationship.receivedGifts]);

	return (
		<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
			{/* ヘッダー部分 */}
			<div className="relative">
				{/* カバー画像 */}
				<div className="h-48 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
					{character.coverImage && (
						<img src={character.coverImage} alt="" className="w-full h-full object-cover" />
					)}
				</div>

				{/* プロファイル情報 */}
				<div className="relative px-6 pb-6">
					<div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
						<CharacterAvatar
							imageUrl={character.profileImage}
							name={character.name}
							size="xl"
							showBorder={true}
							borderColor="ring-white"
						/>

						<div className="flex-1 text-center sm:text-left">
							<h1 className="text-2xl font-bold text-gray-800">{character.name}</h1>
							<p className="text-gray-600">{character.nameKana}</p>
							<p className="text-sm text-gray-500 mt-1">
								{character.age}歳 • {character.occupation} • {character.city}
							</p>
						</div>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={onStartConversation}
							className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors"
						>
							会話を始める
						</motion.button>
					</div>
				</div>
			</div>

			{/* 信頼度セクション */}
			<div className="px-6 py-4 border-t border-gray-200">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-sm font-medium text-gray-700">信頼関係</h3>
						<p className="text-xs text-gray-500 mt-1">
							初めて会った日:{" "}
							{new Date(character.relationship.firstMetAt).toLocaleDateString("ja-JP")}
						</p>
					</div>
					<TrustLevelBadge
						level={character.relationship.trustLevel}
						points={character.relationship.trustPoints}
						nextLevelPoints={character.relationship.nextLevelPoints}
						size="lg"
						showProgress={true}
					/>
				</div>
			</div>

			{/* タブナビゲーション */}
			<div className="border-t border-gray-200">
				<nav className="flex">
					{(["profile", "stories", "gifts"] as const).map((tab) => (
						<button
							type="button"
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`
                flex-1 px-4 py-3 text-sm font-medium transition-colors
                ${
									activeTab === tab
										? "text-blue-600 border-b-2 border-blue-600"
										: "text-gray-600 hover:text-gray-800"
								}
              `}
						>
							{tab === "profile" && "👤 プロフィール"}
							{tab === "stories" && "📖 ストーリー"}
							{tab === "gifts" && "🎁 贈り物"}
						</button>
					))}
				</nav>
			</div>

			{/* タブコンテンツ */}
			<div className="p-6">
				{/* プロフィールタブ */}
				{activeTab === "profile" && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-6"
					>
						<div>
							<h3 className="text-lg font-bold text-gray-800 mb-2">自己紹介</h3>
							<p className="text-gray-600 leading-relaxed">{character.introduction}</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h4 className="text-sm font-medium text-gray-700 mb-2">性格</h4>
								<div className="flex flex-wrap gap-2">
									{character.personality.map((trait, index) => (
										<span
											key={index}
											className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
										>
											{trait}
										</span>
									))}
								</div>
							</div>

							<div>
								<h4 className="text-sm font-medium text-gray-700 mb-2">趣味</h4>
								<div className="flex flex-wrap gap-2">
									{character.hobbies.map((hobby, index) => (
										<span
											key={index}
											className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
										>
											{hobby}
										</span>
									))}
								</div>
							</div>
						</div>

						<div>
							<h4 className="text-sm font-medium text-gray-700 mb-2">得意なこと</h4>
							<div className="flex flex-wrap gap-2">
								{character.specialties.map((specialty, index) => (
									<span
										key={index}
										className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
									>
										{specialty}
									</span>
								))}
							</div>
						</div>

						<div>
							<h4 className="text-sm font-medium text-gray-700 mb-2">地域の特産品</h4>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{character.localSpecialties.map((specialty) => (
									<motion.div
										key={specialty.id}
										whileHover={{ scale: 1.05 }}
										className="text-center"
									>
										<div className="w-full aspect-square rounded-lg overflow-hidden mb-2">
											<img
												src={specialty.imageUrl}
												alt={specialty.name}
												className="w-full h-full object-cover"
											/>
										</div>
										<p className="text-sm font-medium text-gray-700">{specialty.name}</p>
										{specialty.season && (
											<p className="text-xs text-gray-500">旬: {specialty.season}</p>
										)}
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>
				)}

				{/* ストーリータブ */}
				{activeTab === "stories" && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-4"
					>
						{character.stories.map((story) => (
							<div
								key={story.id}
								className={`
                  p-4 rounded-lg border-2
                  ${
										story.isUnlocked
											? "bg-white border-gray-200"
											: "bg-gray-50 border-gray-300 opacity-60"
									}
                `}
							>
								<div className="flex items-start justify-between mb-2">
									<h4 className="font-bold text-gray-800">
										{story.isUnlocked ? story.title : "???"}
									</h4>
									<span className="text-sm text-gray-500">Lv.{story.requiredTrustLevel}必要</span>
								</div>
								{story.isUnlocked ? (
									<p className="text-gray-600">{story.content}</p>
								) : (
									<p className="text-gray-500 italic">
										信頼レベルを{story.requiredTrustLevel}
										まで上げると解放されます
									</p>
								)}
							</div>
						))}
					</motion.div>
				)}

				{/* 贈り物タブ */}
				{activeTab === "gifts" && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-4"
					>
						{/* 統計 */}
						<div className="grid grid-cols-3 gap-4 mb-6">
							<div className="text-center p-4 bg-orange-50 rounded-lg">
								<span className="text-2xl">🍽️</span>
								<p className="text-2xl font-bold text-orange-600">{giftsByCategory.food}</p>
								<p className="text-sm text-gray-600">食べ物</p>
							</div>
							<div className="text-center p-4 bg-purple-50 rounded-lg">
								<span className="text-2xl">🎨</span>
								<p className="text-2xl font-bold text-purple-600">{giftsByCategory.craft}</p>
								<p className="text-sm text-gray-600">工芸品</p>
							</div>
							<div className="text-center p-4 bg-blue-50 rounded-lg">
								<span className="text-2xl">🎁</span>
								<p className="text-2xl font-bold text-blue-600">{giftsByCategory.souvenir}</p>
								<p className="text-sm text-gray-600">お土産</p>
							</div>
						</div>

						{/* 贈り物リスト */}
						<div className="space-y-3">
							{character.relationship.receivedGifts.length > 0 ? (
								character.relationship.receivedGifts.map((gift) => (
									<motion.div
										key={gift.id}
										whileHover={{ x: 5 }}
										className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
									>
										<img
											src={gift.imageUrl}
											alt={gift.name}
											className="w-16 h-16 rounded-lg object-cover"
										/>
										<div className="flex-1">
											<h5 className="font-medium text-gray-800">{gift.name}</h5>
											<p className="text-sm text-gray-600">{gift.description}</p>
											<p className="text-xs text-gray-500 mt-1">
												{new Date(gift.receivedAt).toLocaleDateString("ja-JP")}
												に受け取りました
											</p>
										</div>
									</motion.div>
								))
							) : (
								<div className="text-center py-8 text-gray-500">
									<p className="text-lg mb-2">まだ贈り物を受け取っていません</p>
									<p className="text-sm">信頼レベル5になると特別な贈り物がもらえます！</p>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
};
