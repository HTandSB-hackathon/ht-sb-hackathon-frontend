import {
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	CardBody,
	Center,
	Container,
	Flex,
	HStack,
	Heading,
	Icon,
	IconButton,
	Image,
	Progress,
	SimpleGrid,
	Skeleton,
	SkeletonCircle,
	SkeletonText,
	Spacer,
	Stack,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Tag,
	TagLabel,
	Text,
	Tooltip,
	VStack,
	Wrap,
	WrapItem,
	useBreakpointValue,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React from "react";
import { useEffect, useState } from "react";
import {
	FaArrowLeft,
	FaCalendarAlt,
	FaComment,
	FaGift,
	FaHeart,
	FaLock,
	FaMapMarkerAlt,
	FaShare,
	FaStar,
	FaUnlock,
} from "react-icons/fa";
import {
	MdBook,
	MdCake,
	MdLocationCity,
	MdPerson,
	MdWork,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router";

import {
	municipalityAtomLoadable,
	municipalityFascinatingAtomLoadable,
} from "@/lib/atom/CityAtom";
import { occupationsAtomLoadable } from "@/lib/atom/OccupationAtom";
import type { Relationship, Story } from "@/lib/domain/CharacterQuery";
import {
	getLockedStories,
	getRelationship,
	getStories,
} from "@/lib/domain/CharacterQuery";
import { getChatCountByCharacterId } from "@/lib/domain/ChatQuery";
import type {
	Municipality,
	MunicipalityFascinating,
} from "@/lib/domain/CityQuery";
import { useLoadableAtom } from "@/lib/hook/useLoadableAtom";
import {
	characterDetailLoadingAtom,
	charactersAtomLoadable,
	favoriteCharacterIdsAtom,
	updateRelationshipAtom,
} from "../../lib/atom/CharacterAtom";
import { TRUST_LEVELS } from "../../lib/types/character";
import { SimpleHeader } from "../molecules/SimpleHeader";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

/**
 * キャラクター詳細ページ - 最高のデザイン
 */
export const CharacterDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const characters = useLoadableAtom(charactersAtomLoadable);
	const favoriteCharacterIds = useAtomValue(favoriteCharacterIdsAtom);
	const isFavorite = favoriteCharacterIds.has(Number(id));
	const putFavoriteIds = useSetAtom(updateRelationshipAtom);
	const [stories, setStories] = useState<Story[]>([]);
	const [lockedStories, setLockedStories] = useState<Story[]>([]);
	const [relationship, setRelationship] = useState<Relationship>();
	const [conversationCount, setConversationCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useAtom(characterDetailLoadingAtom);
	const [error, setError] = React.useState<string | null>(null);
	const [tabIndex, setTabIndex] = React.useState(0);

	const occupations = useLoadableAtom(occupationsAtomLoadable);
	const municipalitieFascinations = useLoadableAtom(
		municipalityFascinatingAtomLoadable,
	);

	const toast = useToast();

	// レスポンシブデザイン
	// const isMobile = useBreakpointValue({ base: true, md: false });
	const headerSize = useBreakpointValue({ base: "xl", md: "2xl" });
	const avatarSize = useBreakpointValue({ base: "2xl", md: "3xl" });
	const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });

	// カラーテーマ
	const bgGradient = useColorModeValue(
		"linear(to-br, blue.50, purple.50, pink.50)",
		"linear(to-br, gray.900, purple.900, blue.900)",
	);
	const cardBg = useColorModeValue("white", "gray.800");
	const headerBg = useColorModeValue(
		"rgba(255, 255, 255, 0.9)",
		"rgba(26, 32, 44, 0.9)",
	);

	// 地域テーマ
	const municipalities = useLoadableAtom(municipalityAtomLoadable);

	// 都道府県の市区町村データを取得
	const getMunicipality = () => {
		if (!municipalities) return null;
		const municipality = municipalities.find(
			(m: Municipality) => m.id === getCharacter()?.municipalityId,
		);
		return municipality;
	};

	const getCharacter = () => {
		if (!characters) return null;

		return characters.find((character) => character.id === Number(id));
	};

	const getCity = () => {
		if (!municipalitieFascinations) return null;

		const fascination = municipalitieFascinations?.find(
			(municipalitieFascination: MunicipalityFascinating) =>
				municipalitieFascination.municipalityId ===
				getCharacter()?.municipalityId,
		);
		return fascination;
	};

	// データ取得
	React.useEffect(() => {
		if (id) {
			loadCharacterDetail(id);
		}
	}, [id]);

	const loadCharacterDetail = async (characterId: string) => {
		try {
			setIsLoading(true);
			setError(null);
			const stories = await getStories(characterId);
			setStories(stories);
			const lockedStories = await getLockedStories(characterId);
			setLockedStories(lockedStories);
			const relationship = await getRelationship(Number(characterId));
			setRelationship(relationship);
			const count = await getChatCountByCharacterId(characterId);
			setConversationCount(count);
		} catch (err) {
			console.error("キャラクター詳細読み込みエラー:", err);
			setError("キャラクター情報の読み込みに失敗しました");
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

	const handleStartConversation = () => {
		const characterId = getCharacter()?.id;
		if (characterId) {
			navigate(`/chats/${characterId}`);
		}
	};

	const handleBack = () => {
		navigate("/characters");
	};

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

	// ローディング表示
	if (isLoading) {
		return (
			<Box minH="100vh" bgGradient={bgGradient} position="relative">
				<Container maxW="6xl" p={containerPadding}>
					<VStack spacing={8} align="stretch" py={8}>
						{/* ヘッダースケルトン */}
						<Card bg={cardBg} borderRadius="2xl" shadow="xl">
							<CardBody p={6}>
								<HStack spacing={4}>
									<Skeleton borderRadius="full" boxSize="50px" />
									<VStack align="start" spacing={2} flex={1}>
										<SkeletonText noOfLines={1} width="150px" />
										<SkeletonText noOfLines={1} width="100px" />
									</VStack>
								</HStack>
							</CardBody>
						</Card>

						{/* プロフィールスケルトン */}
						<Card bg={cardBg} borderRadius="2xl" shadow="xl">
							<CardBody p={8}>
								<VStack spacing={6}>
									<SkeletonCircle size="150px" />
									<SkeletonText noOfLines={3} width="80%" textAlign="center" />
									<Skeleton height="40px" width="200px" borderRadius="2xl" />
								</VStack>
							</CardBody>
						</Card>

						{/* コンテンツスケルトン */}
						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
							{Array.from({ length: 4 }).map((_, index) => (
								<Card key={index} bg={cardBg} borderRadius="xl" shadow="lg">
									<CardBody>
										<SkeletonText noOfLines={5} />
									</CardBody>
								</Card>
							))}
						</SimpleGrid>
					</VStack>
				</Container>
			</Box>
		);
	}

	// エラー表示
	if (error || !relationship || !stories) {
		return (
			<Box
				minH="100vh"
				bgGradient={bgGradient}
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Container maxW="md">
					<MotionCard
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						bg={cardBg}
						borderRadius="2xl"
						shadow="2xl"
						p={8}
						textAlign="center"
					>
						<VStack spacing={6}>
							<Text fontSize="6xl">😞</Text>
							<Heading size="lg" color="gray.600">
								読み込みエラー
							</Heading>
							<Text color="gray.500">
								{error || "キャラクター情報が見つかりませんでした"}
							</Text>
							<HStack spacing={4}>
								<Button
									colorScheme="purple"
									onClick={() => id && loadCharacterDetail(id)}
									leftIcon={<Icon as={FaArrowLeft} />}
								>
									再読み込み
								</Button>
								<Button variant="outline" onClick={handleBack}>
									一覧に戻る
								</Button>
							</HStack>
						</VStack>
					</MotionCard>
				</Container>
			</Box>
		);
	}

	const trustLevel = relationship?.trustLevelId || 1;
	const occupation = occupations?.find((occ) => {
		const occupationId = getCharacter()?.occupationId;
		if (!occupationId) {
			return false;
		}
		return occ.id === occupationId;
	});
	const trustInfo = TRUST_LEVELS[trustLevel as keyof typeof TRUST_LEVELS];
	const progress = relationship
		? (relationship.trustPoints / relationship.nextLevelPoints) * 100
		: 0;

	return (
		<Box minH="100vh" bgGradient={bgGradient} position="relative">
			{/* 背景装飾 */}
			<Box position="absolute" inset="0" overflow="hidden" pointerEvents="none">
				<MotionBox
					position="absolute"
					top="-20%"
					right="-20%"
					width="40%"
					height="40%"
					bgGradient="radial(circle, purple.200 0%, transparent 70%)"
					opacity="0.4"
					animate={{
						rotate: [0, 360],
						scale: [1, 1.1, 1],
					}}
					transition={{
						duration: 20,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
			</Box>

			<Container maxW="6xl" p={containerPadding} position="relative" zIndex="1">
				<VStack spacing={8} align="stretch">
					{/* ヘッダー */}
					<SimpleHeader navigateTo="/characters" navigateLavel="一覧へ戻る" />

					{/* メインプロフィール */}
					<MotionCard
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						bg={cardBg}
						borderRadius="2xl"
						shadow="2xl"
						overflow="hidden"
					>
						{/* カバー画像 */}
						<Box
							height="200px"
							bgGradient={
								getMunicipality()?.gradient ||
								"linear(to-r, gray.400, gray.500)"
							}
							position="relative"
						>
							{getCharacter()?.coverImageUrl && (
								<Image
									src={getCharacter()?.coverImageUrl}
									alt=""
									w="full"
									h="full"
									objectFit="cover"
								/>
							)}
							<Box
								position="absolute"
								inset="0"
								bgGradient="linear(to-t, blackAlpha.600, transparent)"
							/>
						</Box>

						<CardBody p={8} mt={-16} position="relative">
							<VStack spacing={6} align="center">
								{/* アバター */}
								<Box position="relative">
									<Avatar
										size={avatarSize}
										src={getCharacter()?.profileImageUrl}
										name={getCharacter()?.name}
										border="6px solid white"
										shadow="2xl"
									/>
									<Box
										position="absolute"
										bottom="2"
										right="2"
										bg="white"
										borderRadius="full"
										p="2"
										border="2px solid"
										borderColor={`${getMunicipality()?.color}.400`}
										fontSize="lg"
									>
										{getMunicipality()?.emoji}
									</Box>
								</Box>

								{/* 基本情報 */}
								<VStack spacing={3} textAlign="center">
									<Heading size={headerSize} color="gray.800" noOfLines={1}>
										{getCharacter()?.name}
									</Heading>

									{/* スマホ表示最適化: 縦並びレイアウト */}
									<VStack
										spacing={2}
										display={{ base: "flex", md: "none" }}
										fontSize="sm"
										color="gray.600"
									>
										<HStack spacing={2}>
											<Icon as={MdCake} color="purple.500" />
											<Text fontWeight="medium">{getCharacter()?.age}歳</Text>
										</HStack>
										<HStack spacing={2}>
											<Icon as={MdWork} color="blue.500" />
											<Text fontWeight="medium" noOfLines={1}>
												{occupation?.name}
											</Text>
										</HStack>
										<HStack spacing={2}>
											<Icon as={FaMapMarkerAlt} color="green.500" />
											<Text fontWeight="medium">{getMunicipality()?.name}</Text>
										</HStack>
									</VStack>

									{/* デスクトップ表示: 横並びレイアウト */}
									<HStack
										spacing={4}
										fontSize="sm"
										color="gray.600"
										wrap="wrap"
										justify="center"
										display={{ base: "none", md: "flex" }}
									>
										<HStack>
											<Icon as={MdCake} color="purple.500" />
											<Text>{getCharacter()?.age}歳</Text>
										</HStack>
										<HStack>
											<Icon as={MdWork} color="blue.500" />
											<Text>{occupation?.name}</Text>
										</HStack>
										<HStack>
											<Icon as={FaMapMarkerAlt} color="green.500" />
											<Text>{getMunicipality()?.name}</Text>
										</HStack>
									</HStack>
								</VStack>

								{/* 信頼度 */}
								{relationship && (
									<Card bg="gray.50" borderRadius="xl" w="full" maxW="md">
										<CardBody p={4}>
											<VStack spacing={3}>
												<HStack justify="space-between" w="full">
													<Badge
														colorScheme={trustInfo.color}
														variant="subtle"
														px={3}
														py={1}
														borderRadius="full"
														fontSize="sm"
													>
														<HStack spacing={1}>
															<FaStar />
															<Text>{trustInfo.name}</Text>
														</HStack>
													</Badge>
													<Text fontSize="sm" color="gray.600">
														Lv.{trustLevel} ({relationship.trustPoints}/
														{relationship.nextLevelPoints})
													</Text>
												</HStack>
												<Progress
													value={progress}
													colorScheme={trustInfo.color}
													size="lg"
													borderRadius="full"
													w="full"
													hasStripe
													isAnimated
												/>
											</VStack>
										</CardBody>
									</Card>
								)}

								{/* アクションボタン */}
								<Stack
									direction={{ base: "column", sm: "row" }}
									spacing={4}
									w={{ base: "full", sm: "auto" }}
									align="center"
								>
									<Button
										colorScheme="purple"
										size={{ base: "md", md: "lg" }}
										leftIcon={<FaComment />}
										onClick={handleStartConversation}
										borderRadius="2xl"
										px={{ base: 6, md: 8 }}
										w={{ base: "full", sm: "auto" }}
										_hover={{
											transform: "translateY(-2px)",
											boxShadow: "lg",
										}}
									>
										会話を始める
									</Button>
									<IconButton
										aria-label="favorite"
										icon={isFavorite ? <FaHeart /> : <FaHeart />}
										colorScheme={isFavorite ? "red" : "gray"}
										variant={isFavorite ? "solid" : "outline"}
										size={{ base: "md", md: "lg" }}
										borderRadius="2xl"
										onClick={() =>
											handleFavoriteToggle(Number(id), !isFavorite)
										}
										_hover={{
											transform: "scale(1.1)",
										}}
									/>
								</Stack>
							</VStack>
						</CardBody>
					</MotionCard>

					{/* タブセクション */}
					<MotionCard
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						bg={cardBg}
						borderRadius="2xl"
						shadow="xl"
					>
						<Tabs
							index={tabIndex}
							onChange={setTabIndex}
							variant="enclosed"
							isLazy
						>
							<TabList
								borderBottom="none"
								bg="gray.50"
								borderTopRadius="2xl"
								overflowX="auto"
							>
								<Tab
									flex="1"
									_selected={{ bg: cardBg, borderColor: "gray.200" }}
									borderRadius="xl"
									m={2}
									fontWeight="bold"
									minW={{ base: "120px", md: "auto" }}
									fontSize={{ base: "xs", md: "sm" }}
								>
									<VStack spacing={1} display={{ base: "flex", sm: "none" }}>
										<Icon as={MdPerson} boxSize={4} />
										<Text>プロフィール</Text>
									</VStack>
									<HStack display={{ base: "none", sm: "flex" }}>
										<Icon as={MdPerson} />
										<Text>プロフィール</Text>
									</HStack>
								</Tab>
								<Tab
									flex="1"
									_selected={{ bg: cardBg, borderColor: "gray.200" }}
									borderRadius="xl"
									m={2}
									fontWeight="bold"
									minW={{ base: "120px", md: "auto" }}
									fontSize={{ base: "xs", md: "sm" }}
								>
									<VStack spacing={1} display={{ base: "flex", sm: "none" }}>
										<Icon as={MdLocationCity} boxSize={4} />
										<Text>地域の魅力</Text>
									</VStack>
									<HStack display={{ base: "none", sm: "flex" }}>
										<Icon as={MdLocationCity} />
										<Text>地域の魅力</Text>
									</HStack>
								</Tab>
								<Tab
									flex="1"
									_selected={{ bg: cardBg, borderColor: "gray.200" }}
									borderRadius="xl"
									m={2}
									fontWeight="bold"
									minW={{ base: "120px", md: "auto" }}
									fontSize={{ base: "xs", md: "sm" }}
								>
									<VStack spacing={1} display={{ base: "flex", sm: "none" }}>
										<Icon as={MdBook} boxSize={4} />
										<Text>ストーリー</Text>
									</VStack>
									<HStack display={{ base: "none", sm: "flex" }}>
										<Icon as={MdBook} />
										<Text>ストーリー</Text>
									</HStack>
								</Tab>
								<Tab
									flex="1"
									_selected={{ bg: cardBg, borderColor: "gray.200" }}
									borderRadius="xl"
									m={2}
									fontWeight="bold"
									minW={{ base: "120px", md: "auto" }}
									fontSize={{ base: "xs", md: "sm" }}
								>
									<VStack spacing={1} display={{ base: "flex", sm: "none" }}>
										<Icon as={FaGift} boxSize={4} />
										<Text>つながり</Text>
									</VStack>
									<HStack display={{ base: "none", sm: "flex" }}>
										<Icon as={FaGift} />
										<Text>つながり</Text>
									</HStack>
								</Tab>
							</TabList>

							<TabPanels>
								{/* プロフィールタブ */}
								<TabPanel p={8}>
									<VStack spacing={8} align="stretch">
										{/* 自己紹介 */}
										<Box>
											<Heading size="md" mb={4} color="gray.700">
												💭 自己紹介
											</Heading>
											<Text color="gray.600" lineHeight="tall" fontSize="lg">
												{getCharacter()?.introduction}
											</Text>
										</Box>

										<SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
											{/* 性格 */}
											<Box>
												<Heading size="sm" mb={4} color="gray.700">
													✨ 性格
												</Heading>
												<Wrap>
													{getCharacter()?.personality.map((trait, index) => (
														<WrapItem key={index}>
															<Tag
																colorScheme="green"
																size="lg"
																borderRadius="full"
															>
																<TagLabel>{trait}</TagLabel>
															</Tag>
														</WrapItem>
													))}
												</Wrap>
											</Box>

											{/* 趣味 */}
											<Box>
												<Heading size="sm" mb={4} color="gray.700">
													🎯 趣味
												</Heading>
												<Wrap>
													{getCharacter()?.hobbies.map((hobby, index) => (
														<WrapItem key={index}>
															<Tag
																colorScheme="blue"
																size="lg"
																borderRadius="full"
															>
																<TagLabel>{hobby}</TagLabel>
															</Tag>
														</WrapItem>
													))}
												</Wrap>
											</Box>

											{/* 得意なこと */}
											<Box>
												<Heading size="sm" mb={4} color="gray.700">
													🏆 得意なこと
												</Heading>
												<Wrap>
													{getCharacter()?.specialties.map(
														(specialty, index) => (
															<WrapItem key={index}>
																<Tag
																	colorScheme="purple"
																	size="lg"
																	borderRadius="full"
																>
																	<TagLabel>{specialty}</TagLabel>
																</Tag>
															</WrapItem>
														),
													)}
												</Wrap>
											</Box>
										</SimpleGrid>
									</VStack>
								</TabPanel>

								{/* 地域の魅力タブ */}
								<TabPanel p={8}>
									<VStack spacing={8}>
										<Box textAlign="center">
											<Heading size="lg" mb={4}>
												{getCity()?.emoji} {getMunicipality()?.name}
												の魅力
											</Heading>
											<Text color="gray.600" fontSize="lg">
												{getCity()?.content}
											</Text>
										</Box>

										<SimpleGrid
											columns={{ base: 1, md: 3 }}
											spacing={6}
											w="full"
										>
											{getCity()?.details.map((detail, index) => (
												<MotionCard
													key={index}
													whileHover={{ y: -5 }}
													bg="blue.50"
													borderRadius="xl"
													textAlign="center"
													p={6}
												>
													<Text fontSize="4xl" mb={4}>
														{detail.emoji}
													</Text>
													<Heading size="md" mb={2}>
														{detail.title}
													</Heading>
													<Text color="gray.600">{detail.content}</Text>
												</MotionCard>
											))}
										</SimpleGrid>

										<Center>
											<Button
												colorScheme="purple"
												size="lg"
												leftIcon={<FaComment />}
												onClick={handleStartConversation}
												borderRadius="2xl"
											>
												{getCharacter()?.name}さんと地域について語る
											</Button>
										</Center>
									</VStack>
								</TabPanel>

								{/* ストーリータブ */}
								<TabPanel p={8}>
									<VStack spacing={6} align="stretch">
										<Heading size="md" textAlign="center" color="gray.700">
											📖 {getCharacter()?.name}さんのストーリー
										</Heading>

										<VStack spacing={4}>
											{stories?.map((story) => (
												<Card
													key={story.id}
													w="full"
													borderRadius="xl"
													shadow={
														relationship.trustLevelId >=
														story.requiredTrustLevel
															? "md"
															: "sm"
													}
													opacity={
														relationship.trustLevelId >=
														story.requiredTrustLevel
															? 1
															: 0.6
													}
													bg={
														relationship.trustLevelId >=
														story.requiredTrustLevel
															? "white"
															: "gray.50"
													}
												>
													<CardBody p={6}>
														<HStack justify="space-between" mb={3}>
															<Heading size="sm">
																{relationship.trustLevelId >=
																story.requiredTrustLevel
																	? story.title
																	: "???"}
															</Heading>
															<HStack>
																<Icon
																	as={
																		relationship.trustLevelId >=
																		story.requiredTrustLevel
																			? FaUnlock
																			: FaLock
																	}
																	color={
																		relationship.trustLevelId >=
																		story.requiredTrustLevel
																			? "green.500"
																			: "gray.400"
																	}
																/>
																<Badge
																	colorScheme={
																		relationship.trustLevelId >=
																		story.requiredTrustLevel
																			? "green"
																			: "gray"
																	}
																>
																	Lv.{story.requiredTrustLevel}必要
																</Badge>
															</HStack>
														</HStack>
														<Text color="gray.600">
															{relationship.trustLevelId >=
															story.requiredTrustLevel
																? story.content
																: `信頼レベルを${story.requiredTrustLevel}まで上げると解放されます`}
														</Text>
													</CardBody>
												</Card>
											))}
											{lockedStories?.map((story) => (
												<Card
													key={story.id}
													w="full"
													borderRadius="xl"
													shadow={
														relationship.trustLevelId >=
														story.requiredTrustLevel
															? "md"
															: "sm"
													}
													opacity={
														relationship.trustLevelId >=
														story.requiredTrustLevel
															? 1
															: 0.6
													}
													bg={
														relationship.trustLevelId >=
														story.requiredTrustLevel
															? "white"
															: "gray.50"
													}
												>
													<CardBody p={6}>
														<HStack justify="space-between" mb={3}>
															<Heading size="sm">
																{relationship.trustLevelId >=
																story.requiredTrustLevel
																	? story.title
																	: "???"}
															</Heading>
															<HStack>
																<Icon
																	as={
																		relationship.trustLevelId >=
																		story.requiredTrustLevel
																			? FaUnlock
																			: FaLock
																	}
																	color={
																		relationship.trustLevelId >=
																		story.requiredTrustLevel
																			? "green.500"
																			: "gray.400"
																	}
																/>
																<Badge
																	colorScheme={
																		relationship.trustLevelId >=
																		story.requiredTrustLevel
																			? "green"
																			: "gray"
																	}
																>
																	Lv.{story.requiredTrustLevel}必要
																</Badge>
															</HStack>
														</HStack>
														<Text color="gray.600">
															{relationship.trustLevelId >=
															story.requiredTrustLevel
																? story.content
																: `信頼レベルを${story.requiredTrustLevel}まで上げると解放されます`}
														</Text>
													</CardBody>
												</Card>
											))}
										</VStack>
									</VStack>
								</TabPanel>

								{/* つながりタブ */}
								<TabPanel p={8}>
									<VStack spacing={8}>
										<Heading size="md" textAlign="center" color="gray.700">
											💕 {getCharacter()?.name}さんとのつながり
										</Heading>

										{relationship && (
											<SimpleGrid
												columns={{ base: 2, md: 4 }}
												spacing={6}
												w="full"
											>
												<Stat textAlign="center">
													<StatLabel>
														<Icon as={FaCalendarAlt} mr={2} />
														初回出会い
													</StatLabel>
													<StatNumber fontSize="md">
														{new Date(
															relationship.firstMetAt,
														).toLocaleDateString("ja-JP")}
													</StatNumber>
												</Stat>

												<Stat textAlign="center">
													<StatLabel>
														<Icon as={FaComment} mr={2} />
														会話回数
													</StatLabel>
													<StatNumber>{conversationCount}</StatNumber>
													<StatHelpText>回</StatHelpText>
												</Stat>

												<Stat textAlign="center">
													<StatLabel>
														<Icon as={FaStar} mr={2} />
														信頼度
													</StatLabel>
													<StatNumber>{relationship.trustPoints}</StatNumber>
													<StatHelpText>ポイント</StatHelpText>
												</Stat>

												<Stat textAlign="center">
													<StatLabel>
														<Icon as={FaGift} mr={2} />
														贈り物
													</StatLabel>
													<StatNumber>
														{/* {characterDetail.relationship.receivedGifts.length} */}
														未定
													</StatNumber>
													<StatHelpText>個</StatHelpText>
												</Stat>
											</SimpleGrid>
										)}

										<Center>
											<Text color="gray.500" fontStyle="italic">
												更なる信頼関係を築いて、特別なストーリーを解放しましょう
											</Text>
										</Center>
									</VStack>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</MotionCard>
				</VStack>
			</Container>

			{/* フローティングアクションボタン */}
			<MotionBox
				position="fixed"
				bottom="8"
				right="8"
				initial={{ scale: 0, rotate: -180 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
				zIndex="1000"
			>
				<Tooltip label="会話を始める" placement="left">
					<IconButton
						aria-label="start conversation"
						icon={<FaComment />}
						colorScheme="purple"
						size="lg"
						borderRadius="2xl"
						boxSize="16"
						shadow="2xl"
						onClick={handleStartConversation}
						_hover={{
							transform: "scale(1.1) rotate(5deg)",
							boxShadow: "2xl",
						}}
					/>
				</Tooltip>
			</MotionBox>
		</Box>
	);
};
