import { achievementsAtomLoadable } from "@/lib/atom/AchivementAtom";
import {
	characterTrustLevelTop3Atom,
	relationshipsAtomLoadable,
} from "@/lib/atom/CharacterAtom";
import { chatCountAllAtomLoadable } from "@/lib/atom/ChatAtom";
import { municipalityWithCharactersAtom } from "@/lib/atom/CityAtom";
import { isUserLoadingAtom, userAtom } from "@/lib/atom/UserAtom";
import { useLoadableAtom } from "@/lib/hook/useLoadableAtom";
import {
	Avatar,
	Badge,
	Box,
	Card,
	CardBody,
	Container,
	Flex,
	Grid,
	HStack,
	Heading,
	Icon,
	IconButton,
	Progress,
	SimpleGrid,
	Spinner,
	Stat,
	StatLabel,
	StatNumber,
	Text,
	VStack,
	useBreakpointValue,
	useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import {
	FaBolt,
	FaCalendarAlt,
	FaComment,
	FaHeart,
	FaMailBulk,
	FaMountain,
	FaRocket,
	FaUsers,
} from "react-icons/fa";
import { MdChatBubble, MdEdit, MdLocationCity, MdPerson } from "react-icons/md";
import { SimpleHeader } from "../molecules/SimpleHeader";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

export default function ProfilePage() {
	const user = useAtomValue(userAtom);
	const isLoading = useAtomValue(isUserLoadingAtom);
	const chatCount = useLoadableAtom(chatCountAllAtomLoadable);
	const relationships = useLoadableAtom(relationshipsAtomLoadable);
	const characterTrustLevelTop3 = useAtomValue(characterTrustLevelTop3Atom);
	const municipalityWithCharacters = useAtomValue(
		municipalityWithCharactersAtom,
	);
	const unklockedAchievements = useLoadableAtom(achievementsAtomLoadable);

	const bgGradient = useColorModeValue(
		"linear(to-br, blue.50, purple.50, pink.50)",
		"linear(to-br, gray.900, purple.900, blue.900)",
	);

	const cardBg = useColorModeValue(
		"rgba(255, 255, 255, 0.8)",
		"rgba(26, 32, 44, 0.8)",
	);

	const gradientText = useColorModeValue(
		"linear(to-r, purple.600, blue.600, teal.500)",
		"linear(to-r, purple.300, blue.300, teal.300)",
	);

	const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3, xl: 4 });
	const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });

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

	if (isLoading) {
		return (
			<Box minH="100vh" bgGradient={bgGradient} position="relative">
				<Box
					position="absolute"
					top="20%"
					left="10%"
					w="100px"
					h="100px"
					borderRadius="full"
					bg="purple.200"
					opacity={0.3}
					filter="blur(40px)"
				/>
				<Box
					position="absolute"
					bottom="30%"
					right="15%"
					w="150px"
					h="150px"
					borderRadius="full"
					bg="blue.200"
					opacity={0.3}
					filter="blur(40px)"
				/>
				<Flex justify="center" align="center" minH="100vh">
					<VStack spacing={4}>
						<Spinner size="xl" color="purple.500" thickness="4px" />
						<Text
							fontSize="lg"
							bgGradient={gradientText}
							bgClip="text"
							fontWeight="bold"
						>
							プロフィールを読み込み中...
						</Text>
					</VStack>
				</Flex>
			</Box>
		);
	}

	return (
		<Box
			minH="100vh"
			bgGradient={bgGradient}
			position="relative"
			overflow="hidden"
		>
			{/* Decorative Background Elements */}
			<Box
				position="absolute"
				top="10%"
				left="5%"
				w="200px"
				h="200px"
				borderRadius="full"
				bg="purple.200"
				opacity={0.2}
				filter="blur(60px)"
				animation="float 6s ease-in-out infinite"
			/>
			<Box
				position="absolute"
				bottom="20%"
				right="10%"
				w="300px"
				h="300px"
				borderRadius="full"
				bg="blue.200"
				opacity={0.2}
				filter="blur(80px)"
				animation="float 8s ease-in-out infinite reverse"
			/>
			<Box
				position="absolute"
				top="50%"
				right="20%"
				w="100px"
				h="100px"
				borderRadius="full"
				bg="teal.200"
				opacity={0.3}
				filter="blur(40px)"
				animation="float 4s ease-in-out infinite"
			/>

			<Container
				maxW="8xl"
				py={containerPadding}
				position="relative"
				zIndex={1}
			>
				<VStack spacing={8} align="stretch">
					{/* ヘッダー */}
					<SimpleHeader
						title="あなたの おふくわけ データ"
						navigateTo="/home"
						navigateLavel="ホームへ戻る"
					/>
					<motion.div
						variants={staggerContainer}
						initial="initial"
						animate="animate"
					>
						{/* Hero Profile Section */}
						<MotionCard
							variants={fadeInUp}
							borderRadius="3xl"
							bg={cardBg}
							backdropFilter="blur(20px)"
							border="1px solid"
							borderColor="whiteAlpha.200"
							shadow="2xl"
							mb={8}
							overflow="hidden"
							position="relative"
						>
							<CardBody p={{ base: 4, md: 8 }} position="relative">
								<VStack spacing={4} align="stretch">
									{/* スマホ版では縦並び、PC版では横並び */}
									<Flex
										direction={{ base: "column", md: "row" }}
										align={{ base: "stretch", md: "flex-start" }}
										gap={{ base: 4, md: 6 }}
									>
										{/* アバター部分 */}
										<MotionBox
											whileHover={{ scale: 1.05 }}
											transition={{ duration: 0.2 }}
											alignSelf={{ base: "center", md: "flex-start" }}
										>
											<Avatar
												size={{ base: "xl", md: "2xl" }}
												name={user?.name || "ユーザー"}
												src={user?.avatarUrl || undefined}
												border="4px solid white"
												shadow="xl"
											/>
										</MotionBox>

										{/* ユーザー情報部分 */}
										<VStack
											align={{ base: "start", md: "start" }}
											spacing={3}
											flex={1}
											textAlign="left"
										>
											<VStack spacing={2} align="start">
												<Heading
													size={{ base: "xl", md: "2xl" }}
													bgGradient={gradientText}
													bgClip="text"
													fontWeight="bold"
													textAlign="left"
												>
													{user?.name || "ユーザー名"}
												</Heading>
												<Badge
													colorScheme="green"
													variant="solid"
													px={3}
													py={1}
													borderRadius="full"
													fontSize="sm"
												>
													🌟 アクティブ
												</Badge>
											</VStack>

											<VStack spacing={2} align="start">
												<HStack spacing={2}>
													<Icon as={FaMailBulk} color="purple.500" />
													<Text
														fontSize={{ base: "sm", md: "md" }}
														color="gray.600"
														wordBreak="break-all"
													>
														{user?.email}
													</Text>
												</HStack>
												<HStack spacing={2}>
													<Icon as={FaCalendarAlt} color="purple.500" />
													<Text
														fontSize={{ base: "sm", md: "md" }}
														color="gray.600"
													>
														登録日: {new Date().toLocaleDateString("ja-JP")}
													</Text>
												</HStack>
											</VStack>
										</VStack>

										{/* 編集ボタン部分 */}
										{/* <Box alignSelf={{ base: "center", md: "flex-start" }}>
                                            <IconButton
                                                aria-label="プロフィール編集"
                                                icon={<MdEdit />}
                                                colorScheme="purple"
                                                variant="ghost"
                                                size={{ base: "md", md: "lg" }}
                                                borderRadius="full"
                                            />
                                        </Box> */}
									</Flex>
								</VStack>
							</CardBody>
						</MotionCard>

						{/* Statistics Dashboard */}
						<MotionBox variants={fadeInUp} mb={8}>
							<SimpleGrid columns={gridColumns} spacing={6}>
								<MotionCard
									whileHover={{ scale: 1.05, y: -5 }}
									borderRadius="2xl"
									bg={cardBg}
									backdropFilter="blur(20px)"
									border="1px solid"
									borderColor="whiteAlpha.200"
									shadow="xl"
									position="relative"
									overflow="hidden"
								>
									<Box
										position="absolute"
										top={0}
										left={0}
										right={0}
										h="4px"
										bgGradient="linear(to-r, green.400, teal.400)"
									/>
									<CardBody p={6}>
										<Stat textAlign="center">
											<StatLabel color="gray.500" fontSize="sm">
												<Icon as={FaUsers} mr={2} />
												出会った人
											</StatLabel>
											<StatNumber
												fontSize="3xl"
												bgGradient="linear(to-r, green.500, teal.500)"
												bgClip="text"
												fontWeight="bold"
												as="span"
												whiteSpace="nowrap"
												display="inline"
											>
												{relationships?.length || 0}
												<span
													style={{ fontSize: "1rem", marginLeft: "0.25em" }}
												>
													人
												</span>
											</StatNumber>
										</Stat>
									</CardBody>
								</MotionCard>

								<MotionCard
									whileHover={{ scale: 1.05, y: -5 }}
									borderRadius="2xl"
									bg={cardBg}
									backdropFilter="blur(20px)"
									border="1px solid"
									borderColor="whiteAlpha.200"
									shadow="xl"
									position="relative"
									overflow="hidden"
								>
									<Box
										position="absolute"
										top={0}
										left={0}
										right={0}
										h="4px"
										bgGradient="linear(to-r, blue.400, purple.400)"
									/>
									<CardBody p={6}>
										<Stat textAlign="center">
											<StatLabel color="gray.500" fontSize="sm">
												<Icon as={MdChatBubble} mr={2} />
												総会話数
											</StatLabel>
											<StatNumber
												fontSize="3xl"
												bgGradient="linear(to-r, blue.500, purple.500)"
												bgClip="text"
												fontWeight="bold"
												as="span"
												whiteSpace="nowrap"
												display="inline"
											>
												{chatCount}
												<span
													style={{ fontSize: "1rem", marginLeft: "0.25em" }}
												>
													回
												</span>
											</StatNumber>
										</Stat>
									</CardBody>
								</MotionCard>

								<MotionCard
									whileHover={{ scale: 1.05, y: -5 }}
									borderRadius="2xl"
									bg={cardBg}
									backdropFilter="blur(20px)"
									border="1px solid"
									borderColor="whiteAlpha.200"
									shadow="xl"
									position="relative"
									overflow="hidden"
								>
									<Box
										position="absolute"
										top={0}
										left={0}
										right={0}
										h="4px"
										bgGradient="linear(to-r, purple.400, pink.400)"
									/>
									<CardBody p={6}>
										<Stat textAlign="center">
											<StatLabel color="gray.500" fontSize="sm">
												<Icon as={FaBolt} mr={2} />
												最高信頼レベル
											</StatLabel>
											<StatNumber
												fontSize="3xl"
												bgGradient="linear(to-r, purple.500, pink.500)"
												bgClip="text"
												fontWeight="bold"
												as="span"
												whiteSpace="nowrap"
												display="inline"
											>
												{relationships?.filter(
													(relationships) => relationships.trustLevelId === 5,
												).length || 0}
											</StatNumber>
										</Stat>
									</CardBody>
								</MotionCard>

								<MotionCard
									whileHover={{ scale: 1.05, y: -5 }}
									borderRadius="2xl"
									bg={cardBg}
									backdropFilter="blur(20px)"
									border="1px solid"
									borderColor="whiteAlpha.200"
									shadow="xl"
									position="relative"
									overflow="hidden"
								>
									<Box
										position="absolute"
										top={0}
										left={0}
										right={0}
										h="4px"
										bgGradient="linear(to-r, orange.400, red.400)"
									/>
									<CardBody p={6}>
										<Stat textAlign="center">
											<StatLabel color="gray.500" fontSize="sm">
												<Icon as={FaHeart} mr={2} />
												お気に入り
											</StatLabel>
											<StatNumber
												fontSize="3xl"
												bgGradient="linear(to-r, orange.500, red.500)"
												bgClip="text"
												fontWeight="bold"
												as="span"
												whiteSpace="nowrap"
												display="inline"
											>
												{relationships?.filter(
													(relationships) => relationships.isFavorite,
												).length || 0}
												<span
													style={{ fontSize: "1rem", marginLeft: "0.25em" }}
												>
													人
												</span>
											</StatNumber>
										</Stat>
									</CardBody>
								</MotionCard>
							</SimpleGrid>
						</MotionBox>

						{/* Achievements Section */}
						<Grid
							templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
							gap={8}
							mb={8}
						>
							<MotionCard
								variants={fadeInUp}
								borderRadius="2xl"
								bg={cardBg}
								backdropFilter="blur(20px)"
								border="1px solid"
								borderColor="whiteAlpha.200"
								shadow="xl"
							>
								<CardBody p={6}>
									<Heading size="lg" mb={6} color="gray.700">
										🏆 実績・バッジ
									</Heading>
									<VStack spacing={4} align="stretch">
										{unklockedAchievements?.map((achievement) => (
											<HStack
												key={achievement.id}
												justify="space-between"
												align="center"
												p={4}
												borderRadius="xl"
												bg="green.50"
											>
												<HStack>
													<Box p={2} borderRadius="lg" bg="green.100">
														<FaUsers color="#38A169" />
													</Box>
													<VStack align="start" spacing={0}>
														<Text fontWeight="bold" color="green.700">
															{achievement.name}
														</Text>
														<Text fontSize="sm" color="green.600">
															{achievement.description}
														</Text>
													</VStack>
												</HStack>
												<Badge
													colorScheme="green"
													size="lg"
													px={3}
													py={1}
													borderRadius="full"
												>
													達成
												</Badge>
											</HStack>
										))}
									</VStack>
								</CardBody>
							</MotionCard>

							{/* Trust Level Progress */}
							<MotionCard
								variants={fadeInUp}
								borderRadius="2xl"
								bg={cardBg}
								backdropFilter="blur(20px)"
								border="1px solid"
								borderColor="whiteAlpha.200"
								shadow="xl"
							>
								<CardBody p={6}>
									<Heading size="lg" mb={6} color="gray.700">
										🌱 信頼レベルの成長
									</Heading>
									<VStack spacing={6} align="stretch">
										{characterTrustLevelTop3?.length > 0 &&
											characterTrustLevelTop3.map((data) => {
												const progress =
													(data.relationship.trustPoints /
														data.relationship.nextLevelPoints) *
													100;

												return (
													<Box key={data.relationship.id}>
														<HStack justify="space-between" mb={2}>
															<Text fontWeight="bold" color="gray.700">
																{data.character?.name} さん
															</Text>
															<Badge
																colorScheme="green"
																px={3}
																py={1}
																borderRadius="full"
															>
																Lv.{data.relationship.trustLevelId}
															</Badge>
														</HStack>
														<Progress
															value={progress}
															size="lg"
															colorScheme="green"
															borderRadius="full"
															hasStripe
															isAnimated
														/>
														<Text fontSize="sm" color="gray.600" mt={1}>
															{data.municipality?.name}・
															{data.character?.occupationId}（次のレベルまで{" "}
															{progress}%）
														</Text>
													</Box>
												);
											})}

										<Box
											p={4}
											borderRadius="xl"
											bg="purple.50"
											border="2px dashed"
											borderColor="purple.200"
										>
											<HStack justify="center">
												<FaRocket color="#805AD5" />
												<Text color="purple.600" fontWeight="bold">
													次のレベルまで あと
													{characterTrustLevelTop3?.length > 0
														? characterTrustLevelTop3.reduce(
																(acc, data) =>
																	acc +
																	(data.relationship.trustPoints /
																		data.relationship.nextLevelPoints) *
																		100,
																0,
															) / characterTrustLevelTop3.length
														: 0}
													%
												</Text>
											</HStack>
										</Box>
									</VStack>
								</CardBody>
							</MotionCard>
						</Grid>

						{/* Regional Connection Map */}
						<MotionCard
							variants={fadeInUp}
							borderRadius="2xl"
							bg={cardBg}
							backdropFilter="blur(20px)"
							border="1px solid"
							borderColor="whiteAlpha.200"
							shadow="xl"
							mb={8}
						>
							<CardBody p={6}>
								<Heading size="lg" mb={6} color="gray.700">
									🗾 福島県でのつながり
								</Heading>
								<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
									{municipalityWithCharacters?.map((municipality) => (
										<VStack
											key={municipality.municipality.id}
											spacing={2}
											p={4}
											borderRadius="xl"
											bg="green.50"
										>
											<FaMountain size={24} color="#38A169" />
											<Text fontWeight="bold" color="green.700">
												{municipality.municipality.name}
											</Text>
											<Text fontSize="sm" color="green.600">
												{municipality.characters.length}人のつながり
											</Text>
										</VStack>
									))}
									<VStack
										spacing={2}
										p={4}
										borderRadius="xl"
										bg="gray.50"
										border="2px dashed"
										borderColor="gray.300"
									>
										<MdPerson size={24} color="#718096" />
										<Text fontWeight="bold" color="gray.600">
											新しいエリア
										</Text>
										<Text fontSize="sm" color="gray.500">
											探索してみよう！
										</Text>
									</VStack>
								</SimpleGrid>
							</CardBody>
						</MotionCard>
					</motion.div>
				</VStack>
			</Container>

			<style>
				{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
			</style>
		</Box>
	);
}
