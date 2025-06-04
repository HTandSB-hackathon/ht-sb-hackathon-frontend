import { getNewCharacterAtom } from "@/lib/atom/CharacterAtom";
import { municipalityAtomLoadable } from "@/lib/atom/CityAtom";
import type { Relationship } from "@/lib/domain/CharacterQuery";
import type { ChatCount } from "@/lib/domain/ChatQuery";
import type { Municipality } from "@/lib/domain/CityQuery";
import { useLoadableAtom } from "@/lib/hook/useLoadableAtom";
import {
	Avatar,
	Badge,
	Box,
	Card,
	CardBody,
	HStack,
	IconButton,
	Progress,
	Spacer,
	Tag,
	TagLabel,
	TagLeftIcon,
	Text,
	Tooltip,
	VStack,
	useBreakpointValue,
	useColorModeValue,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSetAtom } from "jotai";
import React from "react";
import {
	FaClock,
	FaComments,
	FaHeart,
	FaMapMarkerAlt,
	FaRegHeart,
} from "react-icons/fa";
import { MdLock, MdStar } from "react-icons/md";
import { useNavigate } from "react-router";
import type { Character } from "../../lib/domain/CharacterQuery";
import { TRUST_LEVELS } from "../../lib/types/character";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface CharacterCardProps {
	character: Character;
	relationship?: Relationship;
	chatCount?: ChatCount;
	isNew?: boolean;
	animationDelay?: number;
	isFavorite?: boolean;
	onFavoriteToggle?: (characterId: number, isFavorite: boolean) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
	character,
	relationship,
	chatCount,
	isNew = false,
	animationDelay = 0,
	isFavorite = false,
	onFavoriteToggle,
}) => {
	const navigate = useNavigate();
	const [isHovered, setIsHovered] = React.useState(false);
	const municipalities = useLoadableAtom(municipalityAtomLoadable);
	const unlockCharacter = useSetAtom(getNewCharacterAtom);
	// 都道府県の市区町村データを取得
	const getMunicipalityName = () => {
		if (!municipalities) return null;
		const municipality = municipalities.find(
			(m: Municipality) => m.id === character.municipalityId,
		);
		return municipality ? municipality.name : "不明";
	};

	// レスポンシブデザイン
	// const cardSize = useBreakpointValue({ base: "sm", md: "md" });
	const avatarSize = useBreakpointValue({ base: "lg", md: "xl" });
	const spacing = useBreakpointValue({ base: 3, md: 4 });

	// カラーテーマ
	const cardBg = useColorModeValue("white", "gray.800");
	const shadowColor = useColorModeValue(
		"rgba(0, 0, 0, 0.1)",
		"rgba(0, 0, 0, 0.3)",
	);
	const borderColor = useColorModeValue("gray.200", "gray.600");

	const handleClick = () => {
		if (!character.isLocked) {
			navigate(`/characters/${character.id}`);
		} else {
			unlockCharacter(character.id);
		}
	};

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		console.log("handleFavoriteClick called", character.id, isFavorite);
		if (!character.isLocked && onFavoriteToggle) {
			onFavoriteToggle(character.id, !isFavorite);
		}
	};

	// 信頼度情報
	const trustLevel = relationship?.trustLevelId || 1;
	const trustInfo = TRUST_LEVELS[trustLevel as keyof typeof TRUST_LEVELS];
	const progress = relationship
		? (relationship.trustPoints / relationship.nextLevelPoints) * 100
		: 0;

	// 地域テーマ
	const getCityTheme = (city: string) => {
		const themes: Record<
			string,
			{ color: string; emoji: string; gradient: string }
		> = {
			須賀川市: {
				color: "purple",
				emoji: "🍇",
				gradient: "linear(to-r, purple.400, pink.400)",
			},
			三春町: {
				color: "pink",
				emoji: "🌸",
				gradient: "linear(to-r, pink.400, rose.400)",
			},
			中島村: {
				color: "green",
				emoji: "🌾",
				gradient: "linear(to-r, green.400, teal.400)",
			},
		};
		return (
			themes[city] || {
				color: "gray",
				emoji: "🏔️",
				gradient: "linear(to-r, gray.400, gray.500)",
			}
		);
	};

	const cityTheme = getCityTheme("須賀川市");

	// 最後の会話
	const getLastConversationText = () => {
		if (chatCount?.count === 0) return "まだ会話なし";

		const lastDate = new Date();
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - lastDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "今日";
		if (diffDays === 1) return "昨日";
		if (diffDays < 7) return `${diffDays}日前`;
		return "久しく";
	};

	return (
		<MotionCard
			initial={{ opacity: 0, y: 50, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			whileHover={{
				y: -8,
				scale: 1.02,
				transition: { duration: 0.2 },
			}}
			whileTap={{ scale: 0.98 }}
			transition={{
				duration: 0.5,
				delay: animationDelay,
				type: "spring",
				stiffness: 260,
				damping: 20,
			}}
			bg={cardBg}
			borderRadius="2xl"
			boxShadow={`0 8px 32px ${shadowColor}`}
			border="1px solid"
			borderColor={borderColor}
			overflow="hidden"
			position="relative"
			cursor={character.isLocked ? "not-allowed" : "pointer"}
			onClick={handleClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			_hover={{
				boxShadow: `0 16px 48px ${shadowColor}`,
				borderColor: `${cityTheme.color}.300`,
			}}
			opacity={character.isLocked ? 0.7 : 1}
			filter={character.isLocked ? "grayscale(50%)" : "none"}
			maxW="400px"
			w="full"
			minH="260px" // 例: 開放済みキャラクターのカード高さに合わせて最低高さを指定
		>
			{/* NEW バッジ */}
			<AnimatePresence>
				{isNew && !character.isLocked && (
					<MotionBox
						initial={{ opacity: 0, x: 50, rotate: 45 }}
						animate={{ opacity: 1, x: 0, rotate: 0 }}
						exit={{ opacity: 0, x: 50 }}
						position="absolute"
						top="4"
						right="4"
						zIndex="2"
					>
						<Badge
							colorScheme="red"
							variant="solid"
							borderRadius="full"
							px="3"
							py="1"
							fontSize="xs"
							fontWeight="bold"
							textTransform="uppercase"
							animation="pulse 2s infinite"
						>
							✨ NEW
						</Badge>
					</MotionBox>
				)}
			</AnimatePresence>

			{/* グラデーション背景 */}
			<Box
				position="absolute"
				top="0"
				left="0"
				right="0"
				height="120px"
				bgGradient={cityTheme.gradient}
				opacity="0.1"
			/>

			<CardBody p={spacing}>
				<VStack spacing={spacing} align="stretch">
					{/* ヘッダー部分 */}
					<HStack spacing={4} align="start" position="relative">
						<Box position="relative">
							<Avatar
								size={avatarSize}
								src={character.isLocked ? undefined : character.profileImageUrl}
								name={character.isLocked ? "???" : character.name}
								bg={character.isLocked ? "gray.400" : `${cityTheme.color}.500`}
								icon={character.isLocked ? <MdLock /> : undefined}
								border="4px solid"
								borderColor={`${cityTheme.color}.400`}
								shadow="lg"
							/>

							{/* 地域バッジ */}
							{!character.isLocked && (
								<Tooltip label={getMunicipalityName()}>
									<Box
										position="absolute"
										bottom="-2"
										right="-2"
										bg="white"
										borderRadius="full"
										p="1"
										border="2px solid"
										borderColor={`${cityTheme.color}.400`}
										fontSize="sm"
										zIndex={1}
										display="flex"
										alignItems="center"
										height="32px"
									>
										{cityTheme.emoji}
									</Box>
								</Tooltip>
							)}

							{/* オンライン状態 */}
							{relationship && !character.isLocked && (
								<Box
									position="absolute"
									top="0"
									right="0"
									w="4"
									h="4"
									bg="green.400"
									borderRadius="full"
									border="2px solid white"
									animation="pulse 2s infinite"
								/>
							)}
						</Box>

						<VStack align="start" spacing={2} flex="1" position="relative">
							{/* 名前（9文字目以降は省略してツールチップで全量表示） */}
							<Tooltip
								label={!character.isLocked && character.name.length > 8 ? character.name : undefined}
								isDisabled={character.isLocked || character.name.length <= 8}
							>
								<Text
									fontSize={{ base: "lg", md: "xl" }}
									fontWeight="bold"
									color={character.isLocked ? "gray.500" : "gray.800"}
									noOfLines={1}
									overflow="hidden"
									textOverflow="ellipsis"
									whiteSpace="nowrap"
									maxW="100%"
								>
									{character.isLocked
										? "???"
										: character.name.length > 8
											? character.name.slice(0, 8) + "..."
											: character.name}
								</Text>
							</Tooltip>
							{/* 市町村名（9文字目以降は省略してツールチップで全量表示） */}
							<Tooltip
								label={
									!character.isLocked &&
									getMunicipalityName() &&
									getMunicipalityName()!.length > 8
										? getMunicipalityName()
										: undefined
								}
								isDisabled={
									character.isLocked ||
									!getMunicipalityName() ||
									getMunicipalityName()!.length <= 8
								}
							>
								<Tag
									size="sm"
									colorScheme={cityTheme.color}
									variant="subtle"
									maxW="180px"
									overflow="hidden"
									mb={2}
								>
									<TagLeftIcon as={FaMapMarkerAlt} />
									<TagLabel
										noOfLines={1}
										overflow="hidden"
										textOverflow="ellipsis"
										whiteSpace="nowrap"
										maxW="140px"
									>
										{character.isLocked
											? "未解放"
											: getMunicipalityName() && getMunicipalityName()!.length > 8
												? getMunicipalityName()!.slice(0, 8) + "..."
												: getMunicipalityName()}
									</TagLabel>
								</Tag>
							</Tooltip>
						</VStack>
						<Spacer />
						{/* お気に入りボタン */}
						{!character.isLocked && (
							<Box
								position="absolute"
								right="0"
								bottom="-2"
								zIndex={2}
								display="flex"
								alignItems="center"
								height="32px"
							>
								<Tooltip label={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}>
									<IconButton
										aria-label="favorite"
										icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
										colorScheme={isFavorite ? "red" : "gray"}
										variant={isFavorite ? "solid" : "ghost"}
										size="sm"
										borderRadius="full"
										onClick={handleFavoriteClick}
										_hover={{
											transform: "scale(1.1)",
											transition: "transform 0.2s",
										}}
									/>
								</Tooltip>
							</Box>
						)}
					</HStack>

					{/* 信頼度セクション */}
					{relationship && !character.isLocked && (
						<VStack spacing="2" align="stretch">
							<HStack justify="space-between" align="center">
								<Badge
									colorScheme={trustInfo.color}
									variant="subtle"
									borderRadius="full"
									px="3"
									py="1"
									fontSize="xs"
								>
									<HStack spacing="1">
										<MdStar />
										<Text>{trustInfo.name}</Text>
									</HStack>
								</Badge>

								<Text fontSize="xs" color="gray.500" fontWeight="medium">
									Lv.{trustLevel} ({relationship.trustPoints}/
									{relationship.nextLevelPoints})
								</Text>
							</HStack>

							<Progress
								value={progress}
								colorScheme={trustInfo.color}
								size="sm"
								borderRadius="full"
								bg="gray.100"
								hasStripe
								isAnimated
							/>
						</VStack>
					)}

					{/* ロック条件 */}
					{character.isLocked && character.unlockCondition && (
						<Box
							bg="gray.50"
							p="3"
							borderRadius="lg"
							border="1px solid"
							borderColor="gray.200"
							display="flex"
							alignItems="center"
							justifyContent="center"
							minH="80px"
						>
							<HStack spacing="2" justify="center" w="100%">
								<MdLock size="16" color="gray.500" />
								<Text fontSize="xs" color="gray.600" textAlign="center">
									{character.unlockCondition}
								</Text>
							</HStack>
						</Box>
					)}

					{/* ステータス情報 */}
					{!character.isLocked && (
						<HStack justify="space-between" fontSize="xs" color="gray.500">
							<HStack spacing="1">
								<FaComments />
								<Text>{chatCount?.count || 0}回会話</Text>
							</HStack>
							<HStack spacing="1">
								<FaClock />
								<Text>{getLastConversationText()}</Text>
							</HStack>
						</HStack>
					)}

					{/* ホバー時の詳細情報 */}
					<AnimatePresence>
						{isHovered && !character.isLocked && (
							<MotionBox
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2 }}
								overflow="hidden"
							>
								<VStack
									spacing="2"
									align="stretch"
									pt="2"
									borderTop="1px solid"
									borderColor="gray.200"
								>
									<Text fontSize="sm" color="gray.600" noOfLines={3}>
										{character.introduction}
									</Text>

									{character.hobbies && character.hobbies.length > 0 && (
										<HStack spacing="1" wrap="wrap">
											{character.hobbies.slice(0, 3).map((hobby, index) => (
												<Tag
													key={index}
													size="sm"
													colorScheme={cityTheme.color}
													variant="outline"
												>
													{hobby}
												</Tag>
											))}
										</HStack>
									)}
								</VStack>
							</MotionBox>
						)}
					</AnimatePresence>
				</VStack>
			</CardBody>

			{/* 底部のアクセントライン */}
			<MotionBox
				h="3px"
				bgGradient={cityTheme.gradient}
				initial={{ scaleX: 0 }}
				animate={{ scaleX: 1 }}
				transition={{ delay: animationDelay + 0.5, duration: 0.8 }}
			/>
		</MotionCard>
	);
};
