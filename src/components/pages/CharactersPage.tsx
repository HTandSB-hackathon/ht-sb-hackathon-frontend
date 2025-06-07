import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Badge,
	Box,
	Button,
	ButtonGroup,
	Center,
	Collapse,
	Container,
	Flex,
	HStack,
	Heading,
	Icon,
	IconButton,
	Select,
	SimpleGrid,
	Skeleton,
	Spacer,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Tag,
	TagCloseButton,
	TagLabel,
	Text,
	VStack,
	useBreakpointValue,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import type React from "react";
import { useEffect, useState } from "react";
import {
	FaArrowRight,
	FaChevronDown,
	FaChevronUp,
	FaFilter,
	FaRedo,
	FaSort,
	FaStar,
	FaUsers,
} from "react-icons/fa";
import { MdFavorite, MdLocationCity } from "react-icons/md";
import { useNavigate } from "react-router";

import {
	characterCountByTrustLevelAtom,
	characterFilterAtom,
	characterSortByAtom,
	charactersAtomLoadable,
	charactersErrorAtom,
	charactersLoadingAtom,
	favoriteCharacterIdsAtom,
	newlyUnlockedCharacterIdsAtom,
	relationshipsAtomLoadable,
	sortedCharactersAtom,
	updateRelationshipAtom,
	// sortedCharactersAtom,
} from "@/lib/atom/CharacterAtom";
import { chatCountByCharacterIdAtomLoadable } from "@/lib/atom/ChatAtom";
import { municipalityAtomLoadable } from "@/lib/atom/CityAtom";
import { occupationsAtomLoadable } from "@/lib/atom/OccupationAtom";
import type { Municipality } from "@/lib/domain/CityQuery";
import { useLoadableAtom } from "@/lib/hook/useLoadableAtom";
import type {
	CharacterFilter,
	CharacterSortBy,
	TrustLevel,
} from "../../lib/types/character";
import { CharacterCard } from "../atoms/CharacterCard";
import { ClickSound } from "../atoms/ClickSound";
import { SimpleHeader } from "../molecules/SimpleHeader";

const MotionBox = motion(Box);
// const MotionFlex = motion(Flex);

/**
 * 福島の人々との出会いページ - 最高のデザイン
 */
export const CharactersPage: React.FC = () => {
	const characters = useLoadableAtom(charactersAtomLoadable);
	const sortedCharacters = useAtomValue(sortedCharactersAtom);
	const relationships = useLoadableAtom(relationshipsAtomLoadable);
	const chatCountByCharacterIds = useLoadableAtom(
		chatCountByCharacterIdAtomLoadable,
	);
	const [filter, setFilter] = useAtom(characterFilterAtom);
	const [sortBy, setSortBy] = useAtom(characterSortByAtom);
	const [isLoading] = useAtom(charactersLoadingAtom);
	const [error] = useAtom(charactersErrorAtom);
	const favoriteIds = useAtomValue(favoriteCharacterIdsAtom);
	const putFavoriteIds = useSetAtom(updateRelationshipAtom);
	const municipalities = useLoadableAtom(municipalityAtomLoadable);
	const newCharacterIds = useAtomValue(newlyUnlockedCharacterIdsAtom);
	const countByTrustLevel = useAtomValue(characterCountByTrustLevelAtom);

	const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure();
	const navigate = useNavigate();

	// レスポンシブデザイン
	const isMobile = useBreakpointValue({ base: true, md: false });
	const headerSize = useBreakpointValue({ base: "xl", md: "2xl", lg: "3xl" });
	const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });
	const gridColumns = useBreakpointValue({ base: 1, sm: 2, lg: 3, xl: 4 });

	// カラーテーマ
	const bgGradient = useColorModeValue(
		"linear(to-br, blue.50, purple.50, pink.50)",
		"linear(to-br, gray.900, purple.900, blue.900)",
	);
	const cardBg = useColorModeValue("white", "gray.800");
	const headerBg = useColorModeValue(
		"rgba(255, 255, 255, 0.8)",
		"rgba(26, 32, 44, 0.8)",
	);

	const handleFavoriteToggle = async (
		characterId: number,
		isFavorite: boolean,
	) => {
		try {
			putFavoriteIds({ characterId, isFavorite: isFavorite });
		} catch (err) {
			console.error("お気に入り更新エラー:", err);
		}
	};

	const removeFilter = (key: keyof CharacterFilter) => {
		const newFilter = { ...filter };
		delete newFilter[key];
		setFilter(newFilter);
	};

	const activeFilterCount = Object.keys(filter).length;

	const getMunicipalityName = (municipalityId: number) => {
		if (!municipalities) return null;
		const municipality = municipalities.find(
			(m: Municipality) => m.id === municipalityId,
		);
		return municipality?.name;
	};

	return (
		<Box minH="100vh" bgGradient={bgGradient} position="relative">
			{/* 背景装飾 */}
			<Box position="absolute" inset="0" overflow="hidden" pointerEvents="none">
				<MotionBox
					position="absolute"
					top="-50%"
					right="-50%"
					width="100%"
					height="100%"
					bgGradient="radial(circle, purple.200 0%, transparent 70%)"
					opacity="0.3"
					animate={{
						rotate: [0, 360],
						scale: [1, 1.1, 1],
					}}
					transition={{
						duration: 30,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
				<MotionBox
					position="absolute"
					bottom="-30%"
					left="-30%"
					width="80%"
					height="80%"
					bgGradient="radial(circle, blue.200 0%, transparent 70%)"
					opacity="0.2"
					animate={{
						rotate: [360, 0],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 40,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
			</Box>

			<Container maxW="8xl" p={containerPadding} position="relative" zIndex="1">
				<VStack spacing={8} align="stretch">
					{/* ヘッダー */}
					<SimpleHeader
						title="福島のこころ 🌸"
						subtitle="美しい福島で出会う、温かい人々との特別なつながり"
						navigateTo="/home"
						navigateLavel="ホームへ戻る"
					/>

					{/* 統計カード */}
					<MotionBox
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
							<Stat
								bg={cardBg}
								p={4}
								borderRadius="xl"
								shadow="lg"
								border="1px solid"
								borderColor="gray.200"
								textAlign="center"
							>
								<StatLabel color="gray.500" fontSize="sm">
									<Icon as={FaUsers} mr={2} />
									出会った人
								</StatLabel>
								<StatNumber
									fontSize="2xl"
									bgGradient="linear(to-r, blue.600, purple.600)"
									bgClip="text"
									as="span"
									whiteSpace="nowrap"
									display="inline"
								>
									{characters?.length}
									<span style={{ fontSize: "1rem", marginLeft: "0.25em" }}>
										人
									</span>
								</StatNumber>
							</Stat>

							<Stat
								bg={cardBg}
								p={4}
								borderRadius="xl"
								shadow="lg"
								border="1px solid"
								borderColor="gray.200"
								textAlign="center"
							>
								<StatLabel color="gray.500" fontSize="sm">
									<Icon as={FaStar} mr={2} />
									家族同然
								</StatLabel>
								<StatNumber
									fontSize="2xl"
									bgGradient="linear(to-r, yellow.500, orange.500)"
									bgClip="text"
									as="span"
									whiteSpace="nowrap"
									display="inline"
								>
									{countByTrustLevel[5] || 0}
									<span style={{ fontSize: "1rem", marginLeft: "0.25em" }}>
										人
									</span>
								</StatNumber>
							</Stat>

							<Stat
								bg={cardBg}
								p={4}
								borderRadius="xl"
								shadow="lg"
								border="1px solid"
								borderColor="gray.200"
								textAlign="center"
							>
								<StatLabel color="gray.500" fontSize="sm">
									<Icon as={MdLocationCity} mr={2} />
									訪問地域
								</StatLabel>
								{municipalities && (
									<StatNumber
										fontSize="2xl"
										bgGradient="linear(to-r, green.500, teal.500)"
										bgClip="text"
										as="span"
										whiteSpace="nowrap"
										display="inline"
									>
										{municipalities.length}
										<span style={{ fontSize: "1rem", marginLeft: "0.25em" }}>
											箇所
										</span>
									</StatNumber>
								)}
							</Stat>

							<Stat
								bg={cardBg}
								p={4}
								borderRadius="xl"
								shadow="lg"
								border="1px solid"
								borderColor="gray.200"
								textAlign="center"
							>
								<StatLabel color="gray.500" fontSize="sm">
									<Icon as={MdFavorite} mr={2} />
									お気に入り
								</StatLabel>
								<StatNumber
									fontSize="2xl"
									bgGradient="linear(to-r, pink.500, red.500)"
									bgClip="text"
									as="span"
									whiteSpace="nowrap"
									display="inline"
								>
									{favoriteIds.size}
									<span style={{ fontSize: "1rem", marginLeft: "0.25em" }}>
										人
									</span>
								</StatNumber>
							</Stat>
						</SimpleGrid>
					</MotionBox>

					{/* フィルター・ソートエリア */}
					<MotionBox
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<Box
							bg={cardBg}
							borderRadius="xl"
							shadow="lg"
							border="1px solid"
							borderColor="gray.200"
							overflow="hidden"
						>
							<Flex p={4} align="center" gap={4} wrap="wrap">
								<Button
									leftIcon={<FaFilter />}
									rightIcon={isFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
									onClick={onFilterToggle}
									colorScheme="purple"
									variant={isFilterOpen ? "solid" : "outline"}
									size={isMobile ? "sm" : "md"}
								>
									フィルター
									{activeFilterCount > 0 && (
										<Badge
											ml={2}
											colorScheme="red"
											variant="solid"
											borderRadius="full"
										>
											{activeFilterCount}
										</Badge>
									)}
								</Button>

								<HStack spacing={2}>
									<Icon as={FaSort} color="gray.500" />
									<Select
										value={sortBy}
										onChange={(e) =>
											setSortBy(e.target.value as CharacterSortBy)
										}
										bg="white"
										borderColor="gray.300"
										size={isMobile ? "sm" : "md"}
										maxW="200px"
									>
										<option value="trustLevel">💕 信頼度順</option>
										<option value="lastConversation">💬 最近の会話</option>
										<option value="name">📝 名前順</option>
										<option value="city">🏘️ 地域順</option>
									</Select>
								</HStack>

								<Spacer />

								<IconButton
									aria-label="refresh"
									icon={<FaRedo />}
									onClick={() => {}}
									isLoading={isLoading}
									colorScheme="blue"
									variant="ghost"
									size={isMobile ? "sm" : "md"}
								/>
							</Flex>

							{/* アクティブフィルター */}
							{activeFilterCount > 0 && (
								<Box px={4} pb={2}>
									<HStack spacing={2} wrap="wrap">
										{filter.municipalityId && (
											<Tag size="md" colorScheme="blue" borderRadius="full">
												<TagLabel>
													🏘️ {getMunicipalityName(filter.municipalityId)}
												</TagLabel>
												<TagCloseButton
													onClick={() => removeFilter("municipalityId")}
												/>
											</Tag>
										)}
										{filter.trustLevel && (
											<Tag size="md" colorScheme="purple" borderRadius="full">
												<TagLabel>💕 Lv.{filter.trustLevel}</TagLabel>
												<TagCloseButton
													onClick={() => removeFilter("trustLevel")}
												/>
											</Tag>
										)}
										{filter.gender && (
											<Tag size="md" colorScheme="green" borderRadius="full">
												<TagLabel>
													{filter.gender === "male" ? "👨" : "👩"}{" "}
													{filter.gender === "male" ? "男性" : "女性"}
												</TagLabel>
												<TagCloseButton
													onClick={() => removeFilter("gender")}
												/>
											</Tag>
										)}
									</HStack>
								</Box>
							)}

							{/* フィルターパネル */}
							<Collapse in={isFilterOpen}>
								<Box
									p={4}
									borderTop="1px solid"
									borderColor="gray.200"
									bg="gray.50"
								>
									<VStack spacing={4} align="stretch">
										{/* 地域フィルター */}
										<Box>
											<Text
												fontSize="sm"
												fontWeight="bold"
												mb={2}
												color="gray.700"
											>
												🏘️ 地域
											</Text>
											<ButtonGroup
												size="sm"
												variant="outline"
												spacing={2}
												flexWrap="wrap"
											>
												<Button
													onClick={() => removeFilter("municipalityId")}
													colorScheme={
														!filter.municipalityId ? "purple" : "gray"
													}
													variant={!filter.municipalityId ? "solid" : "outline"}
												>
													すべて
												</Button>
												{municipalities?.map((city: Municipality) => (
													<Button
														key={city.id}
														onClick={() =>
															setFilter({ ...filter, municipalityId: city.id })
														}
														colorScheme={
															filter.municipalityId === city.id
																? "purple"
																: "gray"
														}
														variant={
															filter.municipalityId === city.id
																? "solid"
																: "outline"
														}
													>
														{city.name}
													</Button>
												))}
											</ButtonGroup>
										</Box>

										{/* 信頼レベルフィルター */}
										<Box>
											<Text
												fontSize="sm"
												fontWeight="bold"
												mb={2}
												color="gray.700"
											>
												💕 信頼レベル
											</Text>
											<ButtonGroup size="sm" variant="outline" spacing={2}>
												{[1, 2, 3, 4, 5].map((level) => (
													<Button
														key={level}
														onClick={() =>
															setFilter({
																...filter,
																trustLevel: level as TrustLevel,
															})
														}
														colorScheme={
															filter.trustLevel === level ? "purple" : "gray"
														}
														variant={
															filter.trustLevel === level ? "solid" : "outline"
														}
													>
														{"⭐".repeat(level)} Lv.{level}
													</Button>
												))}
											</ButtonGroup>
										</Box>
									</VStack>
								</Box>
							</Collapse>
						</Box>
					</MotionBox>

					{/* エラー表示 */}
					{error && (
						<MotionBox
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
						>
							<Alert status="error" borderRadius="xl">
								<AlertIcon />
								<Box>
									<AlertTitle>エラーが発生しました</AlertTitle>
									<AlertDescription>{error}</AlertDescription>
								</Box>
							</Alert>
						</MotionBox>
					)}

					{/* キャラクターグリッド */}
					<MotionBox
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						{isLoading ? (
							<SimpleGrid columns={gridColumns} spacing={6}>
								{Array.from({ length: 8 }).map((_, index) => (
									<Skeleton
										key={index}
										height="400px"
										borderRadius="2xl"
										startColor="gray.100"
										endColor="gray.300"
									/>
								))}
							</SimpleGrid>
						) : sortedCharacters?.length === 0 ? (
							<Center py={20}>
								<VStack spacing={6} textAlign="center">
									<Text fontSize="6xl">🌸</Text>
									<Heading size="lg" color="gray.600">
										{activeFilterCount > 0
											? "この条件の方は見つかりませんでした"
											: "まだ誰とも出会っていません"}
									</Heading>
									<Text color="gray.500" maxW="md">
										{activeFilterCount > 0
											? "別の条件で検索してみてください"
											: "福島を旅して、素敵な人々と出会いましょう"}
									</Text>
									{activeFilterCount > 0 && (
										<Button
											colorScheme="purple"
											onClick={() => setFilter({})}
											leftIcon={<FaRedo />}
										>
											フィルターをクリア
										</Button>
									)}
								</VStack>
							</Center>
						) : (
							<SimpleGrid columns={gridColumns} spacing={6}>
								<AnimatePresence>
									{sortedCharacters?.map((character, index) => (
										<MotionBox
											key={character.id}
											initial={{ opacity: 0, y: 50 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -50 }}
											transition={{
												duration: 0.5,
												delay: index * 0.1,
											}}
										>
											<ClickSound>
												<CharacterCard
													character={character}
													relationship={relationships?.find(
														(r) => r.characterId === character.id,
													)}
													chatCount={chatCountByCharacterIds?.find(
														(c) => c.characterId === character.id,
													)}
													isNew={newCharacterIds.has(String(character.id))}
													animationDelay={index * 0.1}
													isFavorite={favoriteIds.has(character.id)}
													onFavoriteToggle={handleFavoriteToggle}
												/>
											</ClickSound>
										</MotionBox>
									))}
								</AnimatePresence>
							</SimpleGrid>
						)}
					</MotionBox>
				</VStack>
			</Container>
		</Box>
	);
};
