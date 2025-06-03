import {
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Container,
	Flex,
	Grid,
	GridItem,
	HStack,
	Heading,
	Icon,
	IconButton,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Progress,
	SimpleGrid,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
	VStack,
	useBreakpointValue,
	useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import type React from "react";
import {
	FaArrowRight,
	FaCog,
	FaCrown,
	FaGift,
	FaHeart,
	FaLeaf,
	FaMapMarkerAlt,
	FaRocket,
	FaSignOutAlt,
	FaStar,
	FaUser,
	FaUserFriends,
	FaUsers,
} from "react-icons/fa";
import {
	MdChatBubble,
	MdExplore,
	MdFavorite,
	MdTrendingUp,
} from "react-icons/md";
import { useNavigate } from "react-router";

import {
	characterCountByTrustLevelAtom,
	charactersAtomLoadable,
	favoriteCharacterIdsAtom,
	recentConversationCharacterIdsAtom,
} from "@/lib/atom/CharacterAtom";
import { chatCountAllAtomLoadable } from "@/lib/atom/ChatAtom";
import { userAtom } from "@/lib/atom/UserAtom";
import { useLoadableAtom } from "@/lib/hook/useLoadableAtom";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionFlex = motion(Flex);

/**
 * つな農 - 福島のこころ ホームページ
 * ユーザーが最初に体験する魅力的な世界
 */
const HomePage: React.FC = () => {
	const navigate = useNavigate();

	// 状態管理
	const characters = useLoadableAtom(charactersAtomLoadable);
	const favoriteIds = useAtomValue(favoriteCharacterIdsAtom);
	const recentCharacterIds = useAtomValue(recentConversationCharacterIdsAtom);
	const countByTrustLevel = useAtomValue(characterCountByTrustLevelAtom);
	const user = useAtomValue(userAtom);
	const chatCountAll = useLoadableAtom(chatCountAllAtomLoadable);

	// レスポンシブデザイン（スマホ最適化）
	const heroHeight = useBreakpointValue({
		base: "50vh",
		md: "60vh",
		lg: "70vh",
	});
	const containerPadding = useBreakpointValue({ base: 2, sm: 4, md: 6, lg: 8 });
	const gridTemplateColumns = useBreakpointValue({
		base: "1fr",
		md: "1fr",
		lg: "2fr 1fr",
		xl: "3fr 2fr",
	});
	const heroTitleSize = useBreakpointValue({
		base: "xl",
		sm: "2xl",
		md: "3xl",
	});
	const heroSubtitleSize = useBreakpointValue({
		base: "lg",
		sm: "xl",
		md: "2xl",
	});
	const cardSpacing = useBreakpointValue({ base: 4, md: 6, lg: 8 });
	const statsColumns = useBreakpointValue({ base: 2, sm: 2, md: 4 });

	// カラーテーマ
	const bgGradient = useColorModeValue(
		"linear(to-br, purple.50, blue.50, teal.50, green.50)",
		"linear(to-br, gray.900, purple.900, blue.900)",
	);
	const cardBg = useColorModeValue("white", "gray.800");

	// アニメーション設定
	const fadeInUp = {
		initial: { opacity: 0, y: 60 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.6 },
	};

	const staggerContainer = {
		animate: {
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	// 統計データ
	const totalCharacters = characters?.length || 0;
	const trustLevel5Count = countByTrustLevel[5] || 0;
	const totalFavorites = favoriteIds.size;

	// 最近会話したキャラクター（最大3人）
	const recentCharacters = recentCharacterIds
		.slice(0, 3)
		.map((id) => characters?.find((c) => c.id === Number(id)))
		.filter(Boolean);

	// 現在の時間に基づく挨拶
	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "おはようございます";
		if (hour < 18) return "こんにちは";
		return "こんばんは";
	};

	// 季節の情報
	const getSeasonInfo = () => {
		const month = new Date().getMonth() + 1;
		if (month >= 3 && month <= 5) {
			return {
				season: "春",
				emoji: "🌸",
				message: "桜前線が福島を彩る季節です",
				color: "pink",
			};
		}
		if (month >= 6 && month <= 8) {
			return {
				season: "夏",
				emoji: "🌻",
				message: "福島の夏祭りと青空が輝く季節です",
				color: "yellow",
			};
		}
		if (month >= 9 && month <= 11) {
			return {
				season: "秋",
				emoji: "🍁",
				message: "紅葉と豊穣の実りの季節です",
				color: "orange",
			};
		}
		return {
			season: "冬",
			emoji: "❄️",
			message: "雪景色と温かい心の季節です",
			color: "blue",
		};
	};

	const seasonInfo = getSeasonInfo();

	// 福島の地域情報
	const fukushimaRegions = [
		{
			name: "須賀川市",
			emoji: "🍇",
			color: "purple",
			description: "米どころ、キュウリの名産地",
			gradient: "linear(to-r, purple.400, pink.400)",
		},
		{
			name: "三春町",
			emoji: "🌸",
			color: "pink",
			description: "桜の名所、歴史ある城下町",
			gradient: "linear(to-r, pink.400, rose.400)",
		},
		{
			name: "中島村",
			emoji: "🌾",
			color: "green",
			description: "果樹農業、自然豊かな村",
			gradient: "linear(to-r, green.400, teal.400)",
		},
	];

	return (
		<Box minH="100vh" bgGradient={bgGradient} position="relative">
			{/* フローティングナビゲーション */}
			<Box position="fixed" top={4} right={4} zIndex="1000">
				<Menu>
					<MenuButton
						as={IconButton}
						icon={
							<Avatar
								size="lg"
								name={user?.name || "ユーザー"}
								bg="purple.500"
								color="white"
								shadow="lg"
								border="3px solid"
								borderColor="white"
								cursor="pointer"
								_hover={{
									transform: "scale(1.05)",
									shadow: "xl",
								}}
								transition="all 0.2s"
								src={user?.avatarUrl || undefined}
							/>
						}
						variant="ghost"
						aria-label="メニュー"
						bg="transparent"
						p={0}
						minW="auto"
						h="auto"
						borderRadius="full"
					/>
					<MenuList
						bg={cardBg}
						borderRadius="xl"
						shadow="2xl"
						border="1px solid"
						borderColor="gray.200"
						p={2}
						minW="240px"
					>
						<MenuItem
							icon={<FaUser />}
							borderRadius="lg"
							p={3}
							_hover={{ bg: "purple.50" }}
							onClick={() => navigate("/profile")}
						>
							<VStack align="start" spacing={0}>
								<Text fontWeight="bold">プロフィール</Text>
								<Text fontSize="sm" color="gray.500">
									個人情報の編集
								</Text>
							</VStack>
						</MenuItem>
						<MenuItem
							icon={<FaUserFriends />}
							borderRadius="lg"
							p={3}
							_hover={{ bg: "blue.50" }}
							onClick={() => navigate("/characters")}
						>
							<VStack align="start" spacing={0}>
								<Text fontWeight="bold">キャラクター一覧</Text>
								<Text fontSize="sm" color="gray.500">
									福島の人々と出会う
								</Text>
							</VStack>
						</MenuItem>
						<MenuDivider />
						<MenuItem
							icon={<FaCog />}
							borderRadius="lg"
							p={3}
							_hover={{ bg: "gray.50" }}
							onClick={() => navigate("/settings")}
						>
							設定
						</MenuItem>
						<MenuItem
							icon={<FaSignOutAlt />}
							borderRadius="lg"
							p={3}
							_hover={{ bg: "red.50" }}
							color="red.600"
							onClick={() => {
								// ログアウト処理
								navigate("/login");
							}}
						>
							ログアウト
						</MenuItem>
					</MenuList>
				</Menu>
			</Box>

			{/* 背景装飾エフェクト */}
			<Box position="absolute" inset="0" overflow="hidden" pointerEvents="none">
				<MotionBox
					position="absolute"
					top="-20%"
					right="-20%"
					width="60%"
					height="60%"
					bgGradient="radial(circle, purple.200 0%, transparent 70%)"
					opacity="0.3"
					animate={{
						rotate: [0, 360],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 40,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
				<MotionBox
					position="absolute"
					bottom="-20%"
					left="-20%"
					width="50%"
					height="50%"
					bgGradient="radial(circle, blue.200 0%, transparent 70%)"
					opacity="0.2"
					animate={{
						rotate: [360, 0],
						scale: [1, 1.3, 1],
					}}
					transition={{
						duration: 50,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
			</Box>

			<Container maxW="8xl" p={containerPadding} position="relative" zIndex="1">
				<MotionBox
					initial="initial"
					animate="animate"
					variants={staggerContainer}
				>
					{/* ヒーローセクション */}
					<MotionBox
						variants={fadeInUp}
						mb={12}
						height={heroHeight}
						borderRadius="3xl"
						overflow="hidden"
						position="relative"
						bgGradient="linear(to-br, purple.600, blue.600, teal.500)"
						display="flex"
						alignItems="center"
						justifyContent="center"
					>
						{/* 背景パターン */}
						<Box
							position="absolute"
							inset="0"
							opacity="0.1"
							backgroundImage="radial-gradient(circle at 25% 25%, white 1px, transparent 1px)"
							backgroundSize="50px 50px"
						/>

						<VStack spacing={6} textAlign="center" color="white" zIndex="2">
							<Text fontSize={{ base: "md", sm: "lg", md: "xl" }} opacity="0.9">
								{getGreeting()}！
							</Text>
							<Heading
								size={heroTitleSize}
								fontWeight="extrabold"
								textShadow="lg"
								lineHeight="shorter"
							>
								おかえりなさい 🏠
							</Heading>
							<Text
								fontSize={heroSubtitleSize}
								maxW="2xl"
								opacity="0.95"
								lineHeight="tall"
								px={{ base: 2, sm: 0 }}
							>
								福島のこころが、あなたを待っています
							</Text>
							<VStack spacing={4} pt={4} w="full" maxW="md">
								<Button
									size={{ base: "md", sm: "lg" }}
									w="full"
									maxW="300px"
									bg="whiteAlpha.200"
									color="white"
									borderColor="white"
									border="2px solid"
									rightIcon={<FaArrowRight />}
									onClick={() => navigate("/characters")}
									_hover={{
										bg: "white",
										color: "purple.600",
										transform: "translateY(-2px)",
									}}
									backdropFilter="blur(10px)"
								>
									今日も会話を楽しもう
								</Button>
							</VStack>
						</VStack>
					</MotionBox>

					{/* メインコンテンツグリッド */}
					<Grid templateColumns={gridTemplateColumns} gap={cardSpacing} mb={12}>
						{/* 左カラム */}
						<GridItem>
							<VStack spacing={cardSpacing} align="stretch">
								{/* あなたの福島の旅セクション */}
								<MotionCard
									variants={fadeInUp}
									bg={cardBg}
									borderRadius="2xl"
									shadow="xl"
									border="1px solid"
									borderColor="gray.200"
									overflow="hidden"
								>
									<CardHeader bg="purple.500" color="white" py={4}>
										<HStack>
											<Icon as={FaRocket} />
											<Heading size="lg">あなたの福島の旅</Heading>
										</HStack>
									</CardHeader>
									<CardBody p={6}>
										<SimpleGrid
											columns={statsColumns}
											spacing={{ base: 3, md: 6 }}
										>
											<Stat textAlign="center">
												<StatLabel color="gray.500" fontSize="sm">
													<Icon as={FaUsers} mr={1} />
													出会った人
												</StatLabel>
												<StatNumber
													fontSize="3xl"
													bgGradient="linear(to-r, blue.600, purple.600)"
													bgClip="text"
													fontWeight="bold"
												>
													{totalCharacters}
												</StatNumber>
												<StatHelpText>人</StatHelpText>
											</Stat>

											<Stat textAlign="center">
												<StatLabel color="gray.500" fontSize="sm">
													<Icon as={FaCrown} mr={1} />
													家族同然
												</StatLabel>
												<StatNumber
													fontSize="3xl"
													bgGradient="linear(to-r, yellow.500, orange.500)"
													bgClip="text"
													fontWeight="bold"
												>
													{trustLevel5Count}
												</StatNumber>
												<StatHelpText>人</StatHelpText>
											</Stat>

											<Stat textAlign="center">
												<StatLabel color="gray.500" fontSize="sm">
													<Icon as={MdFavorite} mr={1} />
													お気に入り
												</StatLabel>
												<StatNumber
													fontSize="3xl"
													bgGradient="linear(to-r, pink.500, red.500)"
													bgClip="text"
													fontWeight="bold"
												>
													{totalFavorites}
												</StatNumber>
												<StatHelpText>人</StatHelpText>
											</Stat>

											<Stat textAlign="center">
												<StatLabel color="gray.500" fontSize="sm">
													<Icon as={MdChatBubble} mr={1} />
													総会話数
												</StatLabel>
												<StatNumber
													fontSize="3xl"
													bgGradient="linear(to-r, green.500, teal.500)"
													bgClip="text"
													fontWeight="bold"
												>
													{chatCountAll}
												</StatNumber>
												<StatHelpText>回</StatHelpText>
											</Stat>
										</SimpleGrid>

										{/* 信頼度分布 */}
										<Box mt={8}>
											<Text fontWeight="bold" mb={4} color="gray.700">
												🤝 信頼関係の分布
											</Text>
											<VStack spacing={3}>
												{[
													{ level: 5, name: "家族同然", color: "yellow" },
													{ level: 4, name: "親友", color: "purple" },
													{ level: 3, name: "友達", color: "blue" },
													{ level: 2, name: "顔見知り", color: "green" },
													{ level: 1, name: "初対面", color: "gray" },
												].map(({ level, name, color }) => (
													<Flex key={level} align="center" w="full">
														<Text fontSize="sm" minW="80px" color="gray.600">
															Lv.{level} {name}
														</Text>
														<Progress
															value={
																totalCharacters > 0
																	? (countByTrustLevel[level] /
																			totalCharacters) *
																		100
																	: 0
															}
															colorScheme={color}
															size="lg"
															flex="1"
															mx={3}
															borderRadius="full"
														/>
														<Text fontSize="sm" minW="30px" fontWeight="bold">
															{countByTrustLevel[level] || 0}
														</Text>
													</Flex>
												))}
											</VStack>
										</Box>
									</CardBody>
								</MotionCard>

								{/* 福島の今日セクション */}
								<MotionCard
									variants={fadeInUp}
									bg={cardBg}
									borderRadius="2xl"
									shadow="xl"
									border="1px solid"
									borderColor="gray.200"
									overflow="hidden"
								>
									<CardHeader
										bgGradient={`linear(to-r, ${seasonInfo.color}.400, ${seasonInfo.color}.600)`}
										color="white"
										py={4}
									>
										<HStack>
											<Text fontSize="xl">{seasonInfo.emoji}</Text>
											<Heading size="lg">福島の今日</Heading>
										</HStack>
									</CardHeader>
									<CardBody p={6}>
										<VStack spacing={6} align="stretch">
											<Box
												bg={`${seasonInfo.color}.50`}
												p={4}
												borderRadius="xl"
												border="1px solid"
												borderColor={`${seasonInfo.color}.200`}
											>
												<HStack mb={2}>
													<Text fontSize="2xl">{seasonInfo.emoji}</Text>
													<Text
														fontWeight="bold"
														color={`${seasonInfo.color}.700`}
													>
														福島の{seasonInfo.season}
													</Text>
												</HStack>
												<Text color="gray.700">{seasonInfo.message}</Text>
											</Box>

											<Box>
												<Text fontWeight="bold" mb={4} color="gray.700">
													🗾 福島の魅力的な地域
												</Text>
												<SimpleGrid columns={1} spacing={3}>
													{fukushimaRegions.map((region) => (
														<Box
															key={region.name}
															p={4}
															borderRadius="lg"
															border="1px solid"
															borderColor="gray.200"
															cursor="pointer"
															_hover={{
																borderColor: `${region.color}.300`,
																transform: "translateY(-2px)",
																shadow: "md",
															}}
															transition="all 0.2s"
															onClick={() => navigate("/characters")}
														>
															<HStack>
																<Text fontSize="xl">{region.emoji}</Text>
																<VStack align="start" spacing={1} flex="1">
																	<Text fontWeight="bold" color="gray.800">
																		{region.name}
																	</Text>
																	<Text fontSize="sm" color="gray.600">
																		{region.description}
																	</Text>
																</VStack>
																<Icon as={FaArrowRight} color="gray.400" />
															</HStack>
														</Box>
													))}
												</SimpleGrid>
											</Box>
										</VStack>
									</CardBody>
								</MotionCard>
							</VStack>
						</GridItem>

						{/* 右カラム */}
						<GridItem>
							<VStack spacing={cardSpacing} align="stretch">
								{/* 今日のおすすめセクション */}
								<MotionCard
									variants={fadeInUp}
									bg={cardBg}
									borderRadius="2xl"
									shadow="xl"
									border="1px solid"
									borderColor="gray.200"
									overflow="hidden"
								>
									<CardHeader bg="blue.500" color="white" py={4}>
										<HStack>
											<Icon as={FaStar} />
											<Heading size="lg">今日のおすすめ</Heading>
										</HStack>
									</CardHeader>
									<CardBody p={6}>
										<VStack spacing={6} align="stretch">
											{/* 最近会話したキャラクター */}
											{recentCharacters.length > 0 && (
												<Box>
													<Text fontWeight="bold" mb={3} color="gray.700">
														💬 最近の会話
													</Text>
													<VStack spacing={3}>
														{recentCharacters.map((character) => (
															<Box
																key={character?.id}
																p={3}
																borderRadius="lg"
																border="1px solid"
																borderColor="gray.200"
																w="full"
																cursor="pointer"
																_hover={{
																	borderColor: "blue.300",
																	bg: "blue.50",
																}}
																onClick={() =>
																	navigate(`/characters/${character?.id}`)
																}
															>
																<HStack>
																	<Avatar
																		size="sm"
																		src={character?.profileImageUrl}
																		name={character?.name}
																	/>
																	<VStack align="start" spacing={0} flex="1">
																		<Text fontWeight="medium" fontSize="sm">
																			{character?.name}
																		</Text>
																		<Text fontSize="xs" color="gray.500">
																			福島県
																		</Text>
																	</VStack>
																	<Badge colorScheme="blue" variant="subtle">
																		続ける
																	</Badge>
																</HStack>
															</Box>
														))}
													</VStack>
												</Box>
											)}

											{/* 新しい発見 */}
											<Box>
												<Text fontWeight="bold" mb={3} color="gray.700">
													✨ 新しい発見
												</Text>
												<Box
													p={4}
													bg="green.50"
													borderRadius="lg"
													border="1px solid"
													borderColor="green.200"
												>
													<HStack mb={2}>
														<Icon as={FaLeaf} color="green.500" />
														<Text fontWeight="bold" color="green.700">
															福島の春の訪れ
														</Text>
													</HStack>
													<Text fontSize="sm" color="gray.700">
														新しいキャラクターとの出会いで、福島の春の魅力を発見しましょう。
													</Text>
												</Box>
											</Box>
										</VStack>
									</CardBody>
								</MotionCard>

								{/* クイックアクションセクション */}
								<MotionCard
									variants={fadeInUp}
									bg={cardBg}
									borderRadius="2xl"
									shadow="xl"
									border="1px solid"
									borderColor="gray.200"
									overflow="hidden"
								>
									<CardHeader bg="teal.500" color="white" py={4}>
										<HStack>
											<Icon as={MdExplore} />
											<Heading size="lg">クイックアクション</Heading>
										</HStack>
									</CardHeader>
									<CardBody p={6}>
										<SimpleGrid columns={1} spacing={4}>
											<Button
												leftIcon={<FaUserFriends />}
												colorScheme="purple"
												variant="outline"
												justifyContent="start"
												h="auto"
												p={4}
												onClick={() => navigate("/characters")}
											>
												<VStack align="start" spacing={1}>
													<Text fontWeight="bold">キャラクター一覧</Text>
													<Text fontSize="sm" opacity="0.8">
														福島の人々と出会う
													</Text>
												</VStack>
											</Button>

											<Button
												leftIcon={<FaHeart />}
												colorScheme="red"
												variant="outline"
												justifyContent="start"
												h="auto"
												p={4}
												onClick={() => navigate("/characters")}
											>
												<VStack align="start" spacing={1}>
													<Text fontWeight="bold">お気に入り</Text>
													<Text fontSize="sm" opacity="0.8">
														大切な人たちと再会する
													</Text>
												</VStack>
											</Button>

											<Button
												leftIcon={<FaGift />}
												colorScheme="orange"
												variant="outline"
												justifyContent="start"
												h="auto"
												p={4}
												onClick={() => navigate("/characters")}
											>
												<VStack align="start" spacing={1}>
													<Text fontWeight="bold">福島の贈り物</Text>
													<Text fontSize="sm" opacity="0.8">
														受け取った特産品を確認
													</Text>
												</VStack>
											</Button>
										</SimpleGrid>
									</CardBody>
								</MotionCard>

								{/* 今週のハイライト */}
								<MotionCard
									variants={fadeInUp}
									bg={cardBg}
									borderRadius="2xl"
									shadow="xl"
									border="1px solid"
									borderColor="gray.200"
									overflow="hidden"
								>
									<CardHeader
										bgGradient="linear(to-r, pink.400, purple.500)"
										color="white"
										py={4}
									>
										<HStack>
											<Icon as={MdTrendingUp} />
											<Heading size="lg">今週のハイライト</Heading>
										</HStack>
									</CardHeader>
									<CardBody p={6}>
										<VStack spacing={4} align="stretch">
											<Box
												p={4}
												bg="yellow.50"
												borderRadius="lg"
												border="1px solid"
												borderColor="yellow.200"
											>
												<HStack mb={2}>
													<Icon as={FaCrown} color="yellow.500" />
													<Text fontWeight="bold" color="yellow.700">
														信頼度レベルアップ！
													</Text>
												</HStack>
												<Text fontSize="sm" color="gray.700">
													この週に{trustLevel5Count}
													人の方との関係が深まりました。
												</Text>
											</Box>

											<Box
												p={4}
												bg="blue.50"
												borderRadius="lg"
												border="1px solid"
												borderColor="blue.200"
											>
												<HStack mb={2}>
													<Icon as={FaMapMarkerAlt} color="blue.500" />
													<Text fontWeight="bold" color="blue.700">
														新しい地域を発見
													</Text>
												</HStack>
												<Text fontSize="sm" color="gray.700">
													福島の隠れた魅力スポットについて学びました。
												</Text>
											</Box>

											{favoriteIds.size > 0 && (
												<Box
													p={4}
													bg="pink.50"
													borderRadius="lg"
													border="1px solid"
													borderColor="pink.200"
												>
													<HStack mb={2}>
														<Icon as={FaHeart} color="pink.500" />
														<Text fontWeight="bold" color="pink.700">
															特別な絆
														</Text>
													</HStack>
													<Text fontSize="sm" color="gray.700">
														{favoriteIds.size}人の方をお気に入りに追加しました。
													</Text>
												</Box>
											)}
										</VStack>
									</CardBody>
								</MotionCard>
							</VStack>
						</GridItem>
					</Grid>

					{/* 底部のCTAセクション */}
					<MotionFlex
						variants={fadeInUp}
						bg={cardBg}
						borderRadius="2xl"
						shadow="xl"
						border="1px solid"
						borderColor="gray.200"
						p={{ base: 6, md: 8 }}
						direction={{ base: "column", md: "row" }}
						align="center"
						justify="space-between"
						gap={6}
						textAlign={{ base: "center", md: "left" }}
					>
						<VStack align={{ base: "center", md: "start" }} spacing={2}>
							<Heading size={{ base: "md", md: "lg" }} color="gray.800">
								今日も福島のこころとつながろう 🌸
							</Heading>
							<Text color="gray.600">
								新しい出会いが、あなたを待っています。
							</Text>
						</VStack>
						<VStack spacing={4} w={{ base: "full", md: "auto" }}>
							<Button
								colorScheme="purple"
								size={{ base: "md", sm: "lg" }}
								w={{ base: "full", sm: "auto" }}
								rightIcon={<FaArrowRight />}
								onClick={() => navigate("/characters")}
							>
								新しい出会いを始める
							</Button>
						</VStack>
					</MotionFlex>
				</MotionBox>
			</Container>
		</Box>
	);
};

export default HomePage;
