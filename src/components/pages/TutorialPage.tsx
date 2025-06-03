import {
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Circle,
	Container,
	Flex,
	HStack,
	Heading,
	Icon,
	Progress,
	SimpleGrid,
	Step,
	StepDescription,
	StepIcon,
	StepIndicator,
	StepNumber,
	StepSeparator,
	StepStatus,
	StepTitle,
	Stepper,
	Text,
	VStack,
	useBreakpointValue,
	useColorModeValue,
	useSteps,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import {
	FaArrowRight,
	FaCheck,
	FaCheckCircle,
	FaComment,
	FaCrown,
	FaGift,
	FaHeart,
	FaLeaf,
	FaMagic,
	FaRocket,
	FaStar,
	FaUsers,
} from "react-icons/fa";
import {
	MdChatBubble,
	MdFavorite,
	MdLocationOn,
	MdTrendingUp,
} from "react-icons/md";
import { useNavigate } from "react-router";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);
const MotionFlex = motion(Flex);

/**
 * つな農 - プレミアム チュートリアルページ
 * 福島のこころへようこそ！最高級の初回利用者向けガイド
 */
const TutorialPage: React.FC = () => {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(0);

	// レスポンシブデザイン
	const containerMaxW = useBreakpointValue({
		base: "full",
		md: "container.xl",
	});
	const heroButtonSize = useBreakpointValue({ base: "lg", md: "xl" });
	const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
	const stepperOrientation = useBreakpointValue({
		base: "vertical",
		md: "horizontal",
	}) as "vertical" | "horizontal";

	// カラーテーマ - より豪華に
	const bgGradient = useColorModeValue(
		"linear(135deg, purple.50 0%, blue.50 25%, teal.50 50%, green.50 75%, pink.50 100%)",
		"linear(135deg, gray.900 0%, purple.900 25%, blue.900 50%, teal.900 75%, gray.900 100%)",
	);
	const heroGradient = useColorModeValue(
		"linear(135deg, purple.600 0%, blue.600 25%, teal.500 50%, purple.600 75%, blue.600 100%)",
		"linear(135deg, purple.400 0%, blue.400 25%, teal.300 50%, purple.400 75%, blue.400 100%)",
	);
	const cardBg = useColorModeValue("white", "gray.800");

	// 高度なアニメーション設定
	const fadeInUp = {
		initial: { opacity: 0, y: 60, scale: 0.9 },
		animate: { opacity: 1, y: 0, scale: 1 },
		transition: { duration: 0.8, ease: "easeOut" },
	};

	const staggerContainer = {
		animate: {
			transition: {
				staggerChildren: 0.15,
				delayChildren: 0.1,
			},
		},
	};

	const floatingAnimation = {
		animate: {
			y: [-5, 5, -5],
			transition: {
				duration: 3,
				repeat: Number.POSITIVE_INFINITY,
				ease: "easeInOut",
			},
		},
	};

	const glowAnimation = {
		animate: {
			boxShadow: [
				"0 0 20px rgba(139, 92, 246, 0.3)",
				"0 0 40px rgba(139, 92, 246, 0.6)",
				"0 0 20px rgba(139, 92, 246, 0.3)",
			],
			transition: {
				duration: 2,
				repeat: Number.POSITIVE_INFINITY,
				ease: "easeInOut",
			},
		},
	};

	// Static keys for effects
	const particleKeys = Array.from({ length: 40 }, (_, i) => `particle-${i}`);
	const starKeys = Array.from({ length: 25 }, (_, i) => `star-${i}`);

	// チュートリアルステップデータ - より洗練されたデザイン
	const tutorialSteps = [
		{
			title: "福島のこころへようこそ",
			description: "AIで蘇った福島の魅力的な人々との出会い",
			icon: FaHeart,
			color: "pink",
			gradient: "linear(135deg, pink.400 0%, purple.600 50%, blue.600 100%)",
			content: {
				heading: "福島のこころで体験できること 🌸",
				subtext:
					"AIで再現された福島の魅力的な人々との会話を通じて、親密度を上げることで福島の深い魅力が届きます",
				features: [
					{
						icon: FaComment,
						title: "AIキャラクターとの深い対話",
						description:
							"福島で生きる人々の想いや体験をAIが忠実に再現。会話を重ねることで、その人の人生観や福島への愛が伝わってきます。",
						color: "blue",
						gradient: "linear(135deg, blue.400 0%, teal.500 100%)",
					},
					{
						icon: FaLeaf,
						title: "四季の福島を肌で感じる",
						description:
							"桜前線の北上、夏祭りの熱気、紅葉の絶景、雪国の厳しさと温かさ。福島の四季をキャラクターと一緒に体感できます。",
						color: "green",
						gradient: "linear(135deg, green.400 0%, teal.500 100%)",
					},
					{
						icon: FaGift,
						title: "隠れた福島の魅力発見",
						description:
							"観光ガイドには載らない隠れスポット、代々受け継がれる家庭料理のレシピ、地元民の暮らしの知恵を教わります。",
						color: "orange",
						gradient: "linear(135deg, orange.400 0%, red.500 100%)",
					},
				],
			},
		},
		{
			title: "キャラクターを選ぶ",
			description: "福島の各地域から興味のある人物を選択",
			icon: FaUsers,
			color: "blue",
			gradient: "linear(135deg, blue.400 0%, purple.600 50%, teal.500 100%)",
			content: {
				heading: "多様な福島の人々との出会い 👥",
				subtext:
					"福島県内の各地域から、興味のある人物・時代・職業のAIキャラクターを選択できます",
				characters: [
					{
						name: "佐藤花子さん",
						age: "58歳",
						location: "須賀川市",
						occupation: "農家",
						avatar: "👵",
						specialty: "米作り・キュウリ栽培",
						color: "green",
						gradient: "linear(135deg, green.400 0%, teal.500 100%)",
					},
					{
						name: "田中一郎さん",
						age: "65歳",
						location: "三春町",
						occupation: "桜守",
						avatar: "👴",
						specialty: "桜の手入れ・歴史の語り部",
						color: "pink",
						gradient: "linear(135deg, pink.400 0%, purple.500 100%)",
					},
					{
						name: "鈴木美咲さん",
						age: "35歳",
						location: "中島村",
						occupation: "果樹農家",
						avatar: "👩",
						specialty: "りんご栽培・加工品作り",
						color: "red",
						gradient: "linear(135deg, red.400 0%, orange.500 100%)",
					},
				],
			},
		},
		{
			title: "会話で親密度を深める",
			description: "日常会話から深い話まで、関係性を築く",
			icon: MdChatBubble,
			color: "purple",
			gradient: "linear(135deg, purple.400 0%, blue.600 50%, pink.500 100%)",
			content: {
				heading: "自然な会話で信頼関係を築こう 💬",
				subtext:
					"日常会話から深い話まで、AIキャラクターとの対話を通じて関係性を築いていきます",
				conversationFlow: [
					{
						step: "1",
						title: "挨拶から始まる",
						example: "こんにちは！今日はいい天気ですね。",
						response: "あらまあ、こんにちは！今日は畑仕事も捗りますわ。",
						color: "green",
						gradient: "linear(135deg, green.400 0%, teal.500 100%)",
					},
					{
						step: "2",
						title: "興味を示す",
						example: "何を育てているんですか？",
						response: "主にキュウリとお米ですよ。今年は特にキュウリの出来がいいんです！",
						color: "blue",
						gradient: "linear(135deg, blue.400 0%, purple.500 100%)",
					},
					{
						step: "3",
						title: "深い話を聞く",
						example: "農業を始めたきっかけは？",
						response: "亡くなった主人の実家がここで...（心の内を語る）",
						color: "purple",
						gradient: "linear(135deg, purple.400 0%, pink.500 100%)",
					},
				],
			},
		},
		{
			title: "信頼度システム",
			description: "関係が深まるほど、より深い魅力を発見",
			icon: FaStar,
			color: "yellow",
			gradient: "linear(135deg, yellow.400 0%, orange.500 50%, red.500 100%)",
			content: {
				heading: "信頼レベルで深まる関係性 ⭐",
				subtext:
					"会話を重ねるごとに信頼レベルが上がり、より深い福島の文化や隠れた魅力を教えてもらえます",
				levels: [
					{
						level: 1,
						name: "初対面",
						description: "基本的な挨拶と自己紹介",
						color: "gray",
						gradient: "linear(135deg, gray.400 0%, gray.600 100%)",
						features: ["簡単な会話", "基本情報の共有"],
						icon: FaUsers,
					},
					{
						level: 2,
						name: "顔見知り",
						description: "日常の話題で親しくなる",
						color: "green",
						gradient: "linear(135deg, green.400 0%, teal.500 100%)",
						features: ["趣味の話", "地域の話題", "季節の話"],
						icon: FaComment,
					},
					{
						level: 3,
						name: "友達",
						description: "個人的な体験を共有",
						color: "blue",
						gradient: "linear(135deg, blue.400 0%, purple.500 100%)",
						features: ["人生経験", "家族の話", "思い出話"],
						icon: FaHeart,
					},
					{
						level: 4,
						name: "親友",
						description: "深い信頼関係を築く",
						color: "purple",
						gradient: "linear(135deg, purple.400 0%, pink.500 100%)",
						features: ["秘密の場所", "友達紹介", "特別なレシピ"],
						icon: FaCrown,
					},
					{
						level: 5,
						name: "家族同然",
						description: "最も深い絆",
						color: "yellow",
						gradient: "linear(135deg, yellow.400 0%, orange.500 100%)",
						features: ["福島の特産品", "家族のレシピ", "心の支え"],
						icon: FaMagic,
					},
				],
			},
		},
		{
			title: "レベルアップ特典",
			description: "信頼度が上がると特別な体験が待っている",
			icon: FaCrown,
			color: "orange",
			gradient: "linear(135deg, orange.400 0%, yellow.500 50%, red.500 100%)",
			content: {
				heading: "レベルアップで解放される特典 🎁",
				subtext:
					"信頼レベルが上がるほど、より特別な福島の魅力と体験が待っています",
				rewards: [
					{
						level: "レベル4到達",
						title: "新しい友達紹介",
						description:
							"信頼できる友人として、他の魅力的な福島の人々を紹介してもらえます",
						icon: FaUsers,
						color: "blue",
						gradient: "linear(135deg, blue.400 0%, purple.500 100%)",
					},
					{
						level: "レベル5到達",
						title: "福島の特産品プレゼント",
						description:
							"家族同然の関係になると、実際の福島の特産品を贈り物として受け取れます",
						icon: FaGift,
						color: "red",
						gradient: "linear(135deg, red.400 0%, pink.500 100%)",
					},
					{
						level: "継続利用",
						title: "季節のイベント参加",
						description:
							"桜祭り、夏祭り、収穫祭など、福島の季節イベントに特別参加できます",
						icon: FaLeaf,
						color: "green",
						gradient: "linear(135deg, green.400 0%, teal.500 100%)",
					},
				],
			},
		},
	];

	const { activeStep, setActiveStep } = useSteps({
		index: currentStep,
		count: tutorialSteps.length,
	});

	const handleNext = () => {
		if (currentStep < tutorialSteps.length - 1) {
			setCurrentStep(currentStep + 1);
			setActiveStep(currentStep + 1);
		} else {
			navigate("/home");
		}
	};

	const handlePrev = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
			setActiveStep(currentStep - 1);
		}
	};

	const handleSkip = () => {
		navigate("/home");
	};

	const currentStepData = tutorialSteps[currentStep];

	return (
		<Box minH="100vh" bgGradient={bgGradient} position="relative" overflow="hidden">
			{/* 強化された背景装飾エフェクト */}
			<Box position="absolute" inset="0" overflow="hidden" pointerEvents="none">
				{/* メイングラデーション装飾 */}
				<MotionBox
					position="absolute"
					top="-30%"
					right="-30%"
					width="80%"
					height="80%"
					bgGradient="radial(circle, purple.300 0%, blue.200 40%, transparent 70%)"
					opacity="0.4"
					animate={{
						rotate: [0, 360],
						scale: [1, 1.3, 1],
					}}
					transition={{
						duration: 40,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
				<MotionBox
					position="absolute"
					bottom="-30%"
					left="-30%"
					width="90%"
					height="90%"
					bgGradient="radial(circle, teal.300 0%, green.200 40%, transparent 70%)"
					opacity="0.3"
					animate={{
						rotate: [360, 0],
						scale: [1, 1.4, 1],
					}}
					transition={{
						duration: 50,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>

				{/* パーティクルアニメーション */}
				{particleKeys.map((key) => (
					<MotionBox
						key={key}
						position="absolute"
						top={`${Math.random() * 100}%`}
						left={`${Math.random() * 100}%`}
						width={`${3 + Math.random() * 6}px`}
						height={`${3 + Math.random() * 6}px`}
						bg={`${["purple", "blue", "teal", "pink", "orange"][Math.floor(Math.random() * 5)]}.400`}
						borderRadius="full"
						opacity="0.6"
						animate={{
							y: [0, -150, 0],
							x: [0, Math.random() * 100 - 50, 0],
							scale: [1, 1.8, 1],
							opacity: [0.6, 1, 0.6],
						}}
						transition={{
							duration: 8 + Math.random() * 4,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
							delay: Math.random() * 5,
						}}
					/>
				))}

				{/* 星のアニメーション */}
				{starKeys.map((key) => (
					<MotionBox
						key={key}
						position="absolute"
						top={`${Math.random() * 100}%`}
						left={`${Math.random() * 100}%`}
						width="3px"
						height="3px"
						bg="white"
						borderRadius="full"
						animate={{
							opacity: [0, 1, 0],
							scale: [0, 1.5, 0],
						}}
						transition={{
							duration: 2 + Math.random() * 3,
							repeat: Number.POSITIVE_INFINITY,
							delay: Math.random() * 4,
						}}
					/>
				))}
			</Box>

			<Container maxW={containerMaxW} position="relative" zIndex="1" py={8}>
				<MotionBox
					initial="initial"
					animate="animate"
					variants={staggerContainer}
				>
					{/* 豪華なヘッダーセクション */}
					<MotionBox variants={fadeInUp} textAlign="center" mb={12}>
						<MotionBox {...floatingAnimation}>
							<Badge
								bgGradient="linear(135deg, purple.500 0%, blue.500 50%, teal.500 100%)"
								color="white"
								variant="solid"
								px={8}
								py={4}
								borderRadius="full"
								mb={8}
								fontSize="xl"
								fontWeight="bold"
								shadow="2xl"
								border="2px solid"
								borderColor="whiteAlpha.300"
							>
								🌸 はじめての福島のこころ ✨
							</Badge>
						</MotionBox>
						<MotionHeading
							size="4xl"
							bgGradient={heroGradient}
							bgClip="text"
							fontWeight="black"
							lineHeight="shorter"
							mb={6}
							textShadow="2xl"
						>
							福島のこころへようこそ
						</MotionHeading>
						<MotionText fontSize="2xl" color="gray.600" maxW="4xl" mx="auto" lineHeight="tall">
							AIで蘇った福島の魅力的な人々との出会いが、あなたを待っています。
							<br />
							<Text as="span" bgGradient="linear(to-r, purple.600, blue.600)" bgClip="text" fontWeight="bold">
								簡単なガイドで、福島のこころの使い方をご紹介します。
							</Text>
						</MotionText>
					</MotionBox>

					{/* 美しいステッパー */}
					<MotionBox variants={fadeInUp} mb={12}>
						<MotionCard 
							bg="whiteAlpha.100"
							backdropFilter="blur(20px)"
							borderRadius="3xl" 
							shadow="2xl" 
							border="1px solid"
							borderColor="whiteAlpha.300"
							overflow="hidden"
							{...glowAnimation}
						>
							<CardBody p={10}>
								<Stepper
									index={activeStep}
									orientation={stepperOrientation}
									gap="6"
									colorScheme="purple"
									size="lg"
								>
									{tutorialSteps.map((step, index) => (
										<Step key={index}>
											<StepIndicator>
												<StepStatus
													complete={<StepIcon />}
													incomplete={<StepNumber />}
													active={<StepNumber />}
												/>
											</StepIndicator>

											<Box flexShrink="0">
												<StepTitle>
													<Text
														fontWeight="bold"
														fontSize="lg"
														color={index === activeStep ? `${step.color}.600` : "gray.600"}
													>
														{step.title}
													</Text>
												</StepTitle>
												<StepDescription>
													<Text fontSize="md" color="gray.500">
														{step.description}
													</Text>
												</StepDescription>
											</Box>

											<StepSeparator />
										</Step>
									))}
								</Stepper>
							</CardBody>
						</MotionCard>
					</MotionBox>

					{/* 美しいメインコンテンツエリア */}
					<MotionCard
						variants={fadeInUp}
						bg="whiteAlpha.200"
						backdropFilter="blur(20px)"
						borderRadius="3xl"
						shadow="dark-lg"
						border="2px solid"
						borderColor="whiteAlpha.400"
						overflow="hidden"
						mb={10}
						minH="700px"
						position="relative"
					>
						{/* 動的グラデーションヘッダー */}
						<CardHeader
							bgGradient={currentStepData.gradient}
							color="white"
							py={8}
							position="relative"
							overflow="hidden"
						>
							{/* ヘッダー装飾 */}
							<Box
								position="absolute"
								inset="0"
								bgImage="radial-gradient(circle at 25% 25%, white 1px, transparent 1px)"
								backgroundSize="30px 30px"
								opacity="0.1"
							/>
							<MotionFlex {...floatingAnimation} position="relative" zIndex="2">
								<Circle size="80px" bg="whiteAlpha.300" mr={6} shadow="xl">
									<Icon as={currentStepData.icon} boxSize={10} />
								</Circle>
								<VStack align="start" spacing={2}>
									<Heading size="2xl" textShadow="lg">{currentStepData.title}</Heading>
									<Text opacity="0.95" fontSize="lg">{currentStepData.description}</Text>
								</VStack>
							</MotionFlex>
						</CardHeader>

						<CardBody p={10}>
							{/* ステップ1: サービス紹介 - 超豪華版 */}
							{currentStep === 0 && (
								<VStack spacing={12} align="stretch">
									<Box textAlign="center">
										<Heading size="2xl" mb={6} color="gray.800">
											{currentStepData.content.heading}
										</Heading>
										<Text fontSize="xl" color="gray.600" maxW="5xl" mx="auto" lineHeight="tall">
											{currentStepData.content.subtext}
										</Text>
									</Box>

									<SimpleGrid columns={gridColumns} spacing={10}>
										{currentStepData.content.features?.map((feature, index) => (
											<MotionCard
												key={index}
												bg="white"
												borderRadius="3xl"
												shadow="2xl"
												border="2px solid"
												borderColor="gray.100"
												cursor="pointer"
												whileHover={{
													scale: 1.05,
													rotateY: 5,
													shadow: "dark-lg",
													transition: { duration: 0.3 },
												}}
												initial={{ opacity: 0, y: 50 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: index * 0.2 }}
												position="relative"
												overflow="hidden"
											>
												{/* カード内グラデーション装飾 */}
												<Box
													position="absolute"
													top="0"
													left="0"
													right="0"
													height="6px"
													bgGradient={feature.gradient}
												/>
												
												<CardBody p={8}>
													<VStack spacing={6}>
														<MotionBox {...floatingAnimation}>
															<Circle
																size="100px"
																bgGradient={feature.gradient}
																color="white"
																shadow="2xl"
															>
																<Icon as={feature.icon} boxSize={12} />
															</Circle>
														</MotionBox>
														<Heading size="lg" color="gray.800" textAlign="center">
															{feature.title}
														</Heading>
														<Text
															color="gray.600"
															lineHeight="tall"
															textAlign="center"
															fontSize="md"
														>
															{feature.description}
														</Text>
													</VStack>
												</CardBody>
											</MotionCard>
										))}
									</SimpleGrid>
								</VStack>
							)}

							{/* ステップ2: キャラクター選択 - 豪華版 */}
							{currentStep === 1 && (
								<VStack spacing={12} align="stretch">
									<Box textAlign="center">
										<Heading size="2xl" mb={6} color="gray.800">
											{currentStepData.content.heading}
										</Heading>
										<Text fontSize="xl" color="gray.600" lineHeight="tall">
											{currentStepData.content.subtext}
										</Text>
									</Box>

									<SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
										{currentStepData.content.characters?.map((character, index) => (
											<MotionCard
												key={index}
												bg="white"
												borderRadius="3xl"
												shadow="2xl"
												border="3px solid"
												borderColor={`${character.color}.200`}
												cursor="pointer"
												whileHover={{
													scale: 1.08,
													rotateY: 10,
													shadow: "dark-lg",
													borderColor: `${character.color}.400`,
													transition: { duration: 0.3 },
												}}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: index * 0.3 }}
												position="relative"
												overflow="hidden"
											>
												{/* キャラクターカード装飾 */}
												<Box
													position="absolute"
													top="0"
													left="0"
													right="0"
													height="8px"
													bgGradient={character.gradient}
												/>
												
												<CardBody p={8}>
													<VStack spacing={6}>
														<MotionBox 
															fontSize="6xl" 
															{...floatingAnimation}
															whileHover={{ scale: 1.2 }}
														>
															{character.avatar}
														</MotionBox>
														<VStack spacing={3}>
															<Heading size="lg" color="gray.800">
																{character.name}
															</Heading>
															<Text fontSize="md" color="gray.500" fontWeight="medium">
																{character.age} • {character.location}
															</Text>
															<Badge
																bgGradient={character.gradient}
																color="white"
																variant="solid"
																borderRadius="full"
																px={4}
																py={2}
																fontSize="sm"
															>
																{character.occupation}
															</Badge>
														</VStack>
														<Text
															color="gray.600"
															textAlign="center"
															fontSize="md"
															fontWeight="medium"
														>
															{character.specialty}
														</Text>
													</VStack>
												</CardBody>
											</MotionCard>
										))}
									</SimpleGrid>

									<MotionCard
										bg="linear-gradient(135deg, blue.50 0%, purple.50 100%)"
										p={8}
										borderRadius="2xl"
										border="2px solid"
										borderColor="blue.200"
										textAlign="center"
										whileHover={{ scale: 1.02 }}
									>
										<HStack justify="center" mb={4}>
											<Icon as={FaUsers} color="blue.500" boxSize={6} />
											<Text fontWeight="bold" color="blue.700" fontSize="xl">
												選び方のコツ
											</Text>
										</HStack>
										<Text color="gray.700" fontSize="lg" lineHeight="tall">
											興味のある地域や職業から選んでみてください。
											それぞれ異なる福島の魅力を教えてくれます。
										</Text>
									</MotionCard>
								</VStack>
							)}

							{/* ステップ3: 会話システム - 豪華版 */}
							{currentStep === 2 && (
								<VStack spacing={12} align="stretch">
									<Box textAlign="center">
										<Heading size="2xl" mb={6} color="gray.800">
											{currentStepData.content.heading}
										</Heading>
										<Text fontSize="xl" color="gray.600" lineHeight="tall">
											{currentStepData.content.subtext}
										</Text>
									</Box>

									<VStack spacing={8}>
										{currentStepData.content.conversationFlow?.map((flow, index) => (
											<MotionCard
												key={index}
												bg="white"
												borderRadius="3xl"
												shadow="2xl"
												border="2px solid"
												borderColor="gray.100"
												w="full"
												initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.4 }}
												whileHover={{ scale: 1.02 }}
											>
												{/* フロー装飾 */}
												<Box
													position="absolute"
													top="0"
													left="0"
													right="0"
													height="6px"
													bgGradient={flow.gradient}
												/>
												
												<CardBody p={8}>
													<HStack align="start" spacing={8}>
														<MotionBox {...floatingAnimation}>
															<Circle
																size="80px"
																bgGradient={flow.gradient}
																color="white"
																fontWeight="bold"
																fontSize="2xl"
																flexShrink={0}
																shadow="xl"
															>
																{flow.step}
															</Circle>
														</MotionBox>
														<VStack align="start" spacing={6} flex="1">
															<Heading size="lg" color="gray.800">
																{flow.title}
															</Heading>

															{/* 美しい会話デモ */}
															<Box w="full" bg="gray.50" p={6} borderRadius="2xl">
																<HStack justify="flex-end" mb={4}>
																	<Box
																		bg="blue.500"
																		color="white"
																		p={4}
																		borderRadius="2xl"
																		borderBottomRightRadius="md"
																		maxW="80%"
																		shadow="lg"
																	>
																		<Text fontSize="md">{flow.example}</Text>
																	</Box>
																	<Avatar size="md" bg="blue.500" color="white">
																		👤
																	</Avatar>
																</HStack>

																<HStack justify="flex-start">
																	<Avatar size="md" bg="gray.300">
																		👵
																	</Avatar>
																	<Box
																		bg="white"
																		color="gray.800"
																		p={4}
																		borderRadius="2xl"
																		borderBottomLeftRadius="md"
																		maxW="80%"
																		shadow="lg"
																		border="1px solid"
																		borderColor="gray.200"
																	>
																		<Text fontSize="md">{flow.response}</Text>
																	</Box>
																</HStack>
															</Box>
														</VStack>
													</HStack>
												</CardBody>
											</MotionCard>
										))}
									</VStack>

									<MotionCard
										bg="linear-gradient(135deg, purple.50 0%, pink.50 100%)"
										p={8}
										borderRadius="2xl"
										border="2px solid"
										borderColor="purple.200"
										textAlign="center"
										whileHover={{ scale: 1.02 }}
									>
										<HStack justify="center" mb={4}>
											<Icon as={MdChatBubble} color="purple.500" boxSize={6} />
											<Text fontWeight="bold" color="purple.700" fontSize="xl">
												会話のコツ
											</Text>
										</HStack>
										<Text color="gray.700" fontSize="lg" lineHeight="tall">
											相手に興味を持って質問することで、より深い話を聞くことができます。
											福島弁での返答も楽しんでください。
										</Text>
									</MotionCard>
								</VStack>
							)}

							{/* ステップ4: 信頼度システム - 豪華版 */}
							{currentStep === 3 && (
								<VStack spacing={12} align="stretch">
									<Box textAlign="center">
										<Heading size="2xl" mb={6} color="gray.800">
											{currentStepData.content.heading}
										</Heading>
										<Text fontSize="xl" color="gray.600" lineHeight="tall">
											{currentStepData.content.subtext}
										</Text>
									</Box>

									<VStack spacing={6}>
										{currentStepData.content.levels?.map((level, index) => (
											<MotionCard
												key={index}
												bg="white"
												borderRadius="3xl"
												shadow="2xl"
												border="3px solid"
												borderColor={`${level.color}.200`}
												w="full"
												initial={{ opacity: 0, scale: 0.9 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: index * 0.2 }}
												whileHover={{ scale: 1.02 }}
											>
												{/* レベル装飾 */}
												<Box
													position="absolute"
													top="0"
													left="0"
													right="0"
													height="8px"
													bgGradient={level.gradient}
												/>
												
												<CardBody p={8}>
													<HStack spacing={8} align="start">
														<VStack spacing={4}>
															<MotionBox {...floatingAnimation}>
																<Circle
																	size="80px"
																	bgGradient={level.gradient}
																	color="white"
																	fontWeight="bold"
																	fontSize="xl"
																	shadow="xl"
																>
																	<Icon as={level.icon} boxSize={8} />
																</Circle>
															</MotionBox>
															<Text
																fontSize="xl"
																fontWeight="bold"
																color={`${level.color}.600`}
															>
																Lv.{level.level}
															</Text>
															<Progress
																value={(level.level / 5) * 100}
																colorScheme={level.color}
																size="lg"
																w="80px"
																borderRadius="full"
															/>
														</VStack>
														<VStack align="start" spacing={4} flex="1">
															<HStack>
																<Heading size="xl" color="gray.800">
																	{level.name}
																</Heading>
																<Badge 
																	bgGradient={level.gradient}
																	color="white"
																	variant="solid"
																	px={4}
																	py={2}
																	borderRadius="full"
																>
																	レベル{level.level}
																</Badge>
															</HStack>
															<Text color="gray.600" fontSize="lg">
																{level.description}
															</Text>
															<HStack spacing={6} wrap="wrap">
																{level.features.map((feature, featureIndex) => (
																	<HStack key={featureIndex} spacing={2}>
																		<Icon as={FaCheckCircle} color={`${level.color}.500`} boxSize={4} />
																		<Text fontSize="md" color="gray.600" fontWeight="medium">
																			{feature}
																		</Text>
																	</HStack>
																))}
															</HStack>
														</VStack>
													</HStack>
												</CardBody>
											</MotionCard>
										))}
									</VStack>

									<MotionCard
										bg="linear-gradient(135deg, yellow.50 0%, orange.50 100%)"
										p={8}
										borderRadius="2xl"
										border="2px solid"
										borderColor="yellow.200"
										textAlign="center"
										whileHover={{ scale: 1.02 }}
									>
										<HStack justify="center" mb={4}>
											<Icon as={FaStar} color="yellow.500" boxSize={6} />
											<Text fontWeight="bold" color="yellow.700" fontSize="xl">
												信頼度アップのコツ
											</Text>
										</HStack>
										<Text color="gray.700" fontSize="lg" lineHeight="tall">
											定期的に会話を重ねることで、キャラクターとの信頼関係が深まります。
											個人的な質問や地域の話題に興味を示すと効果的です。
										</Text>
									</MotionCard>
								</VStack>
							)}

							{/* ステップ5: レベルアップ特典 - 超豪華版 */}
							{currentStep === 4 && (
								<VStack spacing={12} align="stretch">
									<Box textAlign="center">
										<Heading size="2xl" mb={6} color="gray.800">
											{currentStepData.content.heading}
										</Heading>
										<Text fontSize="xl" color="gray.600" lineHeight="tall">
											{currentStepData.content.subtext}
										</Text>
									</Box>

									<SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
										{currentStepData.content.rewards?.map((reward, index) => (
											<MotionCard
												key={index}
												bg="white"
												borderRadius="3xl"
												shadow="2xl"
												border="3px solid"
												borderColor={`${reward.color}.200`}
												cursor="pointer"
												whileHover={{
													scale: 1.08,
													rotateY: 10,
													shadow: "dark-lg",
													borderColor: `${reward.color}.400`,
													transition: { duration: 0.3 },
												}}
												initial={{ opacity: 0, y: 50 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: index * 0.3 }}
												position="relative"
												overflow="hidden"
											>
												{/* 報酬カード装飾 */}
												<Box
													position="absolute"
													top="0"
													left="0"
													right="0"
													height="8px"
													bgGradient={reward.gradient}
												/>
												
												<CardBody p={8}>
													<VStack spacing={6}>
														<Badge
															bgGradient={reward.gradient}
															color="white"
															variant="solid"
															px={4}
															py={2}
															borderRadius="full"
															fontSize="md"
														>
															{reward.level}
														</Badge>
														<MotionBox {...floatingAnimation}>
															<Circle
																size="100px"
																bgGradient={reward.gradient}
																color="white"
																shadow="2xl"
															>
																<Icon as={reward.icon} boxSize={12} />
															</Circle>
														</MotionBox>
														<Heading size="lg" color="gray.800" textAlign="center">
															{reward.title}
														</Heading>
														<Text
															color="gray.600"
															lineHeight="tall"
															textAlign="center"
															fontSize="md"
														>
															{reward.description}
														</Text>
													</VStack>
												</CardBody>
											</MotionCard>
										))}
									</SimpleGrid>

									<MotionCard
										bg="linear-gradient(135deg, orange.100 0%, yellow.100 50%, pink.100 100%)"
										border="3px solid"
										borderColor="orange.300"
										borderRadius="3xl"
										shadow="2xl"
										whileHover={{ scale: 1.02 }}
									>
										<CardBody p={10} textAlign="center">
											<VStack spacing={6}>
												<MotionBox {...floatingAnimation}>
													<Text fontSize="5xl">🎉</Text>
												</MotionBox>
												<Heading size="2xl" color="orange.700">
													準備完了！福島のこころを始めよう
												</Heading>
												<Text color="gray.700" fontSize="xl" lineHeight="tall">
													これで福島のこころの使い方がわかりました。
													早速、魅力的な福島の人々との出会いを始めましょう！
												</Text>
											</VStack>
										</CardBody>
									</MotionCard>
								</VStack>
							)}
						</CardBody>
					</MotionCard>

					{/* 美しいナビゲーションボタン */}
					<MotionBox variants={fadeInUp}>
						<Flex justify="space-between" align="center" gap={6}>
							<Button
								variant="ghost"
								colorScheme="gray"
								size={heroButtonSize}
								onClick={handleSkip}
								_hover={{
									bg: "whiteAlpha.200",
									transform: "translateY(-2px)",
								}}
							>
								スキップ
							</Button>

							<HStack spacing={6}>
								{currentStep > 0 && (
									<Button
										variant="outline"
										colorScheme="purple"
										size={heroButtonSize}
										onClick={handlePrev}
										borderWidth="2px"
										_hover={{
											bg: "purple.500",
											color: "white",
											transform: "translateY(-2px)",
											shadow: "xl",
										}}
									>
										戻る
									</Button>
								)}
								<Button
									bgGradient="linear(135deg, purple.500 0%, blue.500 50%, teal.500 100%)"
									color="white"
									size={heroButtonSize}
									rightIcon={
										currentStep === tutorialSteps.length - 1 ? (
											<FaRocket />
										) : (
											<FaArrowRight />
										)
									}
									onClick={handleNext}
									px={10}
									_hover={{
										bgGradient: "linear(135deg, purple.600 0%, blue.600 50%, teal.600 100%)",
										transform: "translateY(-3px)",
										shadow: "2xl",
									}}
									shadow="xl"
								>
									{currentStep === tutorialSteps.length - 1
										? "福島のこころを始める"
										: "次へ"}
								</Button>
							</HStack>
						</Flex>
					</MotionBox>

					{/* 美しいプログレスインジケーター */}
					<MotionBox variants={fadeInUp} textAlign="center" mt={10}>
						<Text fontSize="lg" color="gray.500" mb={4} fontWeight="medium">
							{currentStep + 1} / {tutorialSteps.length}
						</Text>
						<MotionBox
							initial={{ width: 0 }}
							animate={{ width: "100%" }}
							transition={{ duration: 0.8 }}
							maxW="500px"
							mx="auto"
						>
							<Progress
								value={((currentStep + 1) / tutorialSteps.length) * 100}
								bgGradient="linear(135deg, purple.500 0%, blue.500 50%, teal.500 100%)"
								size="xl"
								borderRadius="full"
								shadow="lg"
								bg="whiteAlpha.300"
							/>
						</MotionBox>
					</MotionBox>
				</MotionBox>
			</Container>
		</Box>
	);
};

export default TutorialPage;