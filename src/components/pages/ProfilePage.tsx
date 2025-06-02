import { getUserAtom, isUserLoadingAtom, userAtom } from "@/lib/atom/UserAtom";
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
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import {
	FaBolt,
	FaCalendarAlt,
	FaComment,
	FaGift,
	FaHeart,
	FaMountain,
	FaRocket,
	FaUsers,
} from "react-icons/fa";
import { MdEdit, MdLocationCity, MdPerson } from "react-icons/md";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

export default function ProfilePage() {
	const user = useAtomValue(userAtom);
	const isLoading = useAtomValue(isUserLoadingAtom);
	const fetchUser = useSetAtom(getUserAtom);

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

	useEffect(() => {
		if (!user) {
			fetchUser();
		}
	}, [user, fetchUser]);

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
						<Box
							position="absolute"
							top={0}
							left={0}
							right={0}
							h="120px"
							bgGradient="linear(to-r, purple.500, blue.500, teal.400)"
							opacity={0.8}
						/>
						<CardBody p={8} position="relative">
							<HStack spacing={6} align="start">
								<MotionBox
									whileHover={{ scale: 1.05 }}
									transition={{ duration: 0.2 }}
								>
									<Avatar
										size="2xl"
										name={user?.name || "ユーザー"}
										border="4px solid white"
										shadow="xl"
									/>
								</MotionBox>
								<VStack align="start" spacing={3} flex={1}>
									<HStack>
										<Heading
											size="2xl"
											bgGradient={gradientText}
											bgClip="text"
											fontWeight="bold"
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
									</HStack>
									<Text fontSize="lg" color="gray.600">
										{user?.email}
									</Text>
									<HStack spacing={4}>
										<HStack spacing={2}>
											<FaCalendarAlt color="purple.500" />
											<Text fontSize="sm" color="gray.600">
												登録日: {new Date().toLocaleDateString("ja-JP")}
											</Text>
										</HStack>
									</HStack>
								</VStack>
								<VStack spacing={3}>
									<IconButton
										aria-label="プロフィール編集"
										icon={<MdEdit />}
										colorScheme="purple"
										variant="ghost"
										size="lg"
										borderRadius="full"
									/>
								</VStack>
							</HStack>
						</CardBody>
					</MotionCard>

					{/* Statistics Dashboard */}
					<MotionBox variants={fadeInUp} mb={8}>
						<Heading
							size="xl"
							mb={6}
							textAlign="center"
							bgGradient={gradientText}
							bgClip="text"
						>
							📊 あなたの つな農 データ
						</Heading>
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
										<HStack justify="center" mb={2}>
											<FaUsers size={24} color="#38A169" />
										</HStack>
										<StatNumber
											fontSize="3xl"
											bgGradient="linear(to-r, green.500, teal.500)"
											bgClip="text"
											fontWeight="bold"
										>
											3
										</StatNumber>
										<StatLabel fontSize="md" color="gray.600">
											出会った人数
										</StatLabel>
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
										<HStack justify="center" mb={2}>
											<FaComment size={24} color="#3182CE" />
										</HStack>
										<StatNumber
											fontSize="3xl"
											bgGradient="linear(to-r, blue.500, purple.500)"
											bgClip="text"
											fontWeight="bold"
										>
											48
										</StatNumber>
										<StatLabel fontSize="md" color="gray.600">
											総会話数
										</StatLabel>
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
										<HStack justify="center" mb={2}>
											<FaBolt size={24} color="#805AD5" />
										</HStack>
										<StatNumber
											fontSize="3xl"
											bgGradient="linear(to-r, purple.500, pink.500)"
											bgClip="text"
											fontWeight="bold"
										>
											2
										</StatNumber>
										<StatLabel fontSize="md" color="gray.600">
											最高信頼レベル
										</StatLabel>
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
										<HStack justify="center" mb={2}>
											<FaHeart size={24} color="#E53E3E" />
										</HStack>
										<StatNumber
											fontSize="3xl"
											bgGradient="linear(to-r, orange.500, red.500)"
											bgClip="text"
											fontWeight="bold"
										>
											5
										</StatNumber>
										<StatLabel fontSize="md" color="gray.600">
											お気に入り
										</StatLabel>
									</Stat>
								</CardBody>
							</MotionCard>
						</SimpleGrid>
					</MotionBox>

					{/* Achievements Section */}
					<Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8} mb={8}>
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
									<HStack
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
													初めての出会い
												</Text>
												<Text fontSize="sm" color="green.600">
													初回の農家さんとの出会いを達成
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

									<HStack
										justify="space-between"
										align="center"
										p={4}
										borderRadius="xl"
										bg="blue.50"
									>
										<HStack>
											<Box p={2} borderRadius="lg" bg="blue.100">
												<FaBolt color="#3182CE" />
											</Box>
											<VStack align="start" spacing={0}>
												<Text fontWeight="bold" color="blue.700">
													信頼レベル2達成
												</Text>
												<Text fontSize="sm" color="blue.600">
													深い信頼関係を築きました
												</Text>
											</VStack>
										</HStack>
										<Badge
											colorScheme="blue"
											size="lg"
											px={3}
											py={1}
											borderRadius="full"
										>
											達成
										</Badge>
									</HStack>

									<HStack
										justify="space-between"
										align="center"
										p={4}
										borderRadius="xl"
										bg="purple.50"
									>
										<HStack>
											<Box p={2} borderRadius="lg" bg="purple.100">
												<FaComment color="#805AD5" />
											</Box>
											<VStack align="start" spacing={0}>
												<Text fontWeight="bold" color="purple.700">
													おしゃべり上手
												</Text>
												<Text fontSize="sm" color="purple.600">
													10回以上の会話を達成
												</Text>
											</VStack>
										</HStack>
										<Badge
											colorScheme="purple"
											size="lg"
											px={3}
											py={1}
											borderRadius="full"
										>
											達成
										</Badge>
									</HStack>

									<HStack
										justify="space-between"
										align="center"
										p={4}
										borderRadius="xl"
										bg="gray.50"
									>
										<HStack>
											<Box p={2} borderRadius="lg" bg="gray.100">
												<FaGift color="#718096" />
											</Box>
											<VStack align="start" spacing={0}>
												<Text fontWeight="bold" color="gray.700">
													贈り物コレクター
												</Text>
												<Text fontSize="sm" color="gray.600">
													農家さんからの贈り物を受け取る
												</Text>
											</VStack>
										</HStack>
										<Badge
											colorScheme="gray"
											size="lg"
											px={3}
											py={1}
											borderRadius="full"
										>
											未達成
										</Badge>
									</HStack>
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
									<Box>
										<HStack justify="space-between" mb={2}>
											<Text fontWeight="bold" color="gray.700">
												佐藤花子さん
											</Text>
											<Badge
												colorScheme="green"
												px={3}
												py={1}
												borderRadius="full"
											>
												Lv.2
											</Badge>
										</HStack>
										<Progress
											value={80}
											size="lg"
											colorScheme="green"
											borderRadius="full"
											hasStripe
											isAnimated
										/>
										<Text fontSize="sm" color="gray.600" mt={1}>
											須賀川市・農家（信頼度 80%）
										</Text>
									</Box>

									<Box>
										<HStack justify="space-between" mb={2}>
											<Text fontWeight="bold" color="gray.700">
												田中一郎さん
											</Text>
											<Badge
												colorScheme="blue"
												px={3}
												py={1}
												borderRadius="full"
											>
												Lv.1
											</Badge>
										</HStack>
										<Progress
											value={45}
											size="lg"
											colorScheme="blue"
											borderRadius="full"
											hasStripe
											isAnimated
										/>
										<Text fontSize="sm" color="gray.600" mt={1}>
											三春町・農家（信頼度 45%）
										</Text>
									</Box>

									<Box>
										<HStack justify="space-between" mb={2}>
											<Text fontWeight="bold" color="gray.700">
												鈴木太郎さん
											</Text>
											<Badge
												colorScheme="purple"
												px={3}
												py={1}
												borderRadius="full"
											>
												Lv.1
											</Badge>
										</HStack>
										<Progress
											value={30}
											size="lg"
											colorScheme="purple"
											borderRadius="full"
											hasStripe
											isAnimated
										/>
										<Text fontSize="sm" color="gray.600" mt={1}>
											会津若松市・農家（信頼度 30%）
										</Text>
									</Box>

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
												次のレベルまで あと20%
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
								<VStack spacing={2} p={4} borderRadius="xl" bg="green.50">
									<FaMountain size={24} color="#38A169" />
									<Text fontWeight="bold" color="green.700">
										須賀川市
									</Text>
									<Text fontSize="sm" color="green.600">
										1人の農家さん
									</Text>
								</VStack>
								<VStack spacing={2} p={4} borderRadius="xl" bg="blue.50">
									<MdLocationCity size={24} color="#3182CE" />
									<Text fontWeight="bold" color="blue.700">
										三春町
									</Text>
									<Text fontSize="sm" color="blue.600">
										1人の農家さん
									</Text>
								</VStack>
								<VStack spacing={2} p={4} borderRadius="xl" bg="purple.50">
									<FaMountain size={24} color="#805AD5" />
									<Text fontWeight="bold" color="purple.700">
										会津若松市
									</Text>
									<Text fontSize="sm" color="purple.600">
										1人の農家さん
									</Text>
								</VStack>
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
