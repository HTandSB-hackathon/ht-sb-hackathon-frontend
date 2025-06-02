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
	useToast,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import React from "react";
import {
	FaChevronDown,
	FaChevronUp,
	FaFilter,
	FaRedo,
	FaSort,
	FaStar,
	FaUsers,
} from "react-icons/fa";
import { MdFavorite, MdLocationCity } from "react-icons/md";

import { municipalityAtomLoadable } from "@/lib/atom/CityAtom";
import type { Municipality } from "@/lib/domain/CityQuery";
import { useLoadableAtom } from "@/lib/hook/useLoadableAtom";
import {
	characterCountByTrustLevelAtom,
	characterFilterAtom,
	characterRelationshipsAtom,
	characterSortByAtom,
	// charactersAtom,
	charactersAtomLoadable,
	charactersErrorAtom,
	charactersLoadingAtom,
	// charactersTotalAtom,
	favoriteCharacterIdsAtom,
	lockedCharactersAtomLoadable,
	newlyUnlockedCharacterIdsAtom,
	// sortedCharactersAtom,
} from "../../lib/atom/CharacterAtom";
import { CharacterQuery } from "../../lib/domain/CharacterQuery";
import type { CharacterFilter, CharacterSortBy, TrustLevel } from "../../lib/types/character";
import { CharacterCard } from "../atoms/CharacterCard";

const MotionBox = motion(Box);
// const MotionFlex = motion(Flex);

/**
 * 福島の人々との出会いページ - 最高のデザイン
 */
export const CharactersPage: React.FC = () => {
	const characters = useLoadableAtom(charactersAtomLoadable);
	const lockedCharacters = useLoadableAtom(lockedCharactersAtomLoadable);
	const [relationships] = useAtom(characterRelationshipsAtom);
	const [filter, setFilter] = useAtom(characterFilterAtom);
	const [sortBy, setSortBy] = useAtom(characterSortByAtom);
	const [isLoading, setIsLoading] = useAtom(charactersLoadingAtom);
	const [error, setError] = useAtom(charactersErrorAtom);
	const [favoriteIds, setFavoriteIds] = useAtom(favoriteCharacterIdsAtom);
	const municipalities = useLoadableAtom(municipalityAtomLoadable);
	// const [, setTotal] = useAtom(charactersTotalAtom);

	// const sortedCharacters = useAtomValue(sortedCharactersAtom);
	const newCharacterIds = useAtomValue(newlyUnlockedCharacterIdsAtom);
	const countByTrustLevel = useAtomValue(characterCountByTrustLevelAtom);

	const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure();
	const toast = useToast();

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
	const headerBg = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(26, 32, 44, 0.8)");

	// データ取得
	React.useEffect(() => {
		loadCharacters();
	}, []);

	React.useEffect(() => {
		loadCharacters();
	}, [sortBy, filter]);

	const loadCharacters = async () => {
		try {
			setIsLoading(true);
			setError(null);
			// setRelationships(data.relationships);

			// const favoriteCharacters = await CharacterQuery.getFavoriteCharacters();
			// setFavoriteIds(new Set(favoriteCharacters.map((c) => c.id)));
		} catch (err) {
			console.error("キャラクター読み込みエラー:", err);
			setError("キャラクターの読み込みに失敗しました");
			toast({
				title: "エラー",
				description: "データの読み込みに失敗しました",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleFavoriteToggle = async (characterId: string, isFavorite: boolean) => {
		try {
			await CharacterQuery.toggleFavorite(characterId, isFavorite);

			if (isFavorite) {
				setFavoriteIds(new Set([...favoriteIds, characterId]));
			} else {
				const newIds = new Set(favoriteIds);
				newIds.delete(characterId);
				setFavoriteIds(newIds);
			}

			toast({
				title: isFavorite ? "お気に入りに追加" : "お気に入りから削除",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		} catch (err) {
			console.error("お気に入り更新エラー:", err);
			toast({
				title: "エラー",
				description: "お気に入りの更新に失敗しました",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const removeFilter = (key: keyof CharacterFilter) => {
		const newFilter = { ...filter };
		delete newFilter[key];
		setFilter(newFilter);
	};

	const activeFilterCount = Object.keys(filter).length;

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
					<MotionBox
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<Box
							bg={headerBg}
							backdropFilter="blur(20px)"
							borderRadius="2xl"
							p={6}
							border="1px solid"
							borderColor="whiteAlpha.200"
							shadow="xl"
						>
							<VStack spacing={4} textAlign="center">
								<Heading
									size={headerSize}
									bgGradient="linear(to-r, purple.600, blue.600, teal.500)"
									bgClip="text"
									fontWeight="extrabold"
								>
									福島のこころ 🌸
								</Heading>
								<Text
									fontSize={{ base: "md", md: "lg" }}
									color="gray.600"
									maxW="2xl"
									lineHeight="tall"
								>
									美しい福島で出会う、温かい人々との特別なつながり
								</Text>
							</VStack>
						</Box>
					</MotionBox>

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
								>
									{characters?.length}
								</StatNumber>
								<StatHelpText>人</StatHelpText>
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
								>
									{countByTrustLevel[5] || 0}
								</StatNumber>
								<StatHelpText>人</StatHelpText>
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
									>
										{municipalities.length}
									</StatNumber>
								)}
								<StatHelpText>箇所</StatHelpText>
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
								>
									{favoriteIds.size}
								</StatNumber>
								<StatHelpText>人</StatHelpText>
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
										<Badge ml={2} colorScheme="red" variant="solid" borderRadius="full">
											{activeFilterCount}
										</Badge>
									)}
								</Button>

								<HStack spacing={2}>
									<Icon as={FaSort} color="gray.500" />
									<Select
										value={sortBy}
										onChange={(e) => setSortBy(e.target.value as CharacterSortBy)}
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
									onClick={loadCharacters}
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
										{filter.city && (
											<Tag size="md" colorScheme="blue" borderRadius="full">
												<TagLabel>🏘️ {filter.city}</TagLabel>
												<TagCloseButton onClick={() => removeFilter("city")} />
											</Tag>
										)}
										{filter.trustLevel && (
											<Tag size="md" colorScheme="purple" borderRadius="full">
												<TagLabel>💕 Lv.{filter.trustLevel}</TagLabel>
												<TagCloseButton onClick={() => removeFilter("trustLevel")} />
											</Tag>
										)}
										{filter.gender && (
											<Tag size="md" colorScheme="green" borderRadius="full">
												<TagLabel>
													{filter.gender === "male" ? "👨" : "👩"}{" "}
													{filter.gender === "male" ? "男性" : "女性"}
												</TagLabel>
												<TagCloseButton onClick={() => removeFilter("gender")} />
											</Tag>
										)}
									</HStack>
								</Box>
							)}

							{/* フィルターパネル */}
							<Collapse in={isFilterOpen}>
								<Box p={4} borderTop="1px solid" borderColor="gray.200" bg="gray.50">
									<VStack spacing={4} align="stretch">
										{/* 地域フィルター */}
										<Box>
											<Text fontSize="sm" fontWeight="bold" mb={2} color="gray.700">
												🏘️ 地域
											</Text>
											<ButtonGroup size="sm" variant="outline" spacing={2} flexWrap="wrap">
												<Button
													onClick={() => removeFilter("city")}
													colorScheme={!filter.city ? "purple" : "gray"}
													variant={!filter.city ? "solid" : "outline"}
												>
													すべて
												</Button>
												{municipalities?.map((city: Municipality) => (
													<Button
														key={city.id}
														onClick={() => setFilter({ ...filter, city: city.id })}
														colorScheme={filter.city === city.id ? "purple" : "gray"}
														variant={filter.city === city.id ? "solid" : "outline"}
													>
														{city.name}
													</Button>
												))}
											</ButtonGroup>
										</Box>

										{/* 信頼レベルフィルター */}
										<Box>
											<Text fontSize="sm" fontWeight="bold" mb={2} color="gray.700">
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
														colorScheme={filter.trustLevel === level ? "purple" : "gray"}
														variant={filter.trustLevel === level ? "solid" : "outline"}
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
						<MotionBox initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
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
						) : characters?.length === 0 ? (
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
									{characters?.map((character, index) => (
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
											<CharacterCard
												character={character}
												relationship={relationships[character.id]}
												isNew={newCharacterIds.has(String(character.id))}
												animationDelay={index * 0.1}
												onFavoriteToggle={handleFavoriteToggle}
											/>
										</MotionBox>
									))}
									{lockedCharacters?.map((character, index) => (
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
											<CharacterCard
												character={character}
												relationship={relationships[character.id]}
												isNew={newCharacterIds.has(String(character.id))}
												animationDelay={index * 0.1}
												onFavoriteToggle={handleFavoriteToggle}
											/>
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
