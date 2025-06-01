import React from "react";
import { useNavigate } from "react-router";
import {
	Box,
	Container,
	VStack,
	HStack,
	Text,
	Heading,
	Button,
	SimpleGrid,
	Card,
	CardBody,
	Avatar,
	Badge,
	Icon,
	Flex,
	Spacer,
	useColorModeValue,
	useBreakpointValue,
	Stack,
	Image,
	Center,
	Circle,
	Divider,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
	FaHeart,
	FaUsers,
	FaMapMarkerAlt,
	FaShieldAlt,
	FaStar,
	FaRocket,
	FaGift,
	FaUserPlus,
	FaSignInAlt,
	FaChevronDown,
	FaPlay,
	FaComment,
	FaHandshake,
	FaGlobe,
	FaMountain,
	FaLeaf,
	FaSnowflake,
	FaCrown,
	FaFireAlt,
	FaBolt,
	FaGem,
	FaCheck,
	FaSearch,
} from "react-icons/fa";
import {
	MdFavorite,
	MdLocationOn,
	MdSecurity,
	MdSpeed,
	MdGroup,
	MdVerifiedUser,
	MdChat,
	MdTrendingUp,
} from "react-icons/md";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

/**
 * 福島のこころ - 最高品質のランディングページ
 * 誰もが魅力を感じる圧倒的なLPを実現
 */
const LandingPage: React.FC = () => {
	const navigate = useNavigate();

	// レスポンシブデザイン
	const isMobile = useBreakpointValue({ base: true, md: false });
	const containerMaxW = useBreakpointValue({
		base: "full",
		md: "container.xl",
	});
	const heroButtonSize = useBreakpointValue({ base: "lg", md: "xl" });
	const heroButtonDirection = useBreakpointValue({
		base: "column",
		md: "row",
	}) as any;
	const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
	const testimonialColumns = useBreakpointValue({ base: 1, lg: 2 });

	// カラーテーマ
	const bgGradient = useColorModeValue(
		"linear(to-br, purple.50, blue.50, teal.50, pink.50)",
		"linear(to-br, gray.900, purple.900, blue.900)",
	);
	const heroGradient = useColorModeValue(
		"linear(to-br, purple.600, blue.600, teal.500)",
		"linear(to-br, purple.400, blue.400, teal.300)",
	);
	const cardBg = useColorModeValue("white", "gray.800");
	const sectionBg = useColorModeValue("gray.50", "gray.900");

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

	const scaleOnHover = {
		whileHover: {
			scale: 1.05,
			transition: { duration: 0.2 },
		},
	};

	return (
		<Box minH="100vh" bg={bgGradient} position="relative" overflow="hidden">
			{/* 背景装飾エフェクト */}
			<Box position="absolute" inset="0" overflow="hidden" pointerEvents="none">
				{/* メイン装飾 */}
				<MotionBox
					position="absolute"
					top="-20%"
					right="-20%"
					width="50%"
					height="50%"
					bgGradient="radial(circle, purple.200 0%, transparent 70%)"
					opacity="0.4"
					animate={{
						rotate: [0, 360],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 30,
						repeat: Infinity,
						ease: "linear",
					}}
				/>
				<MotionBox
					position="absolute"
					bottom="-20%"
					left="-20%"
					width="60%"
					height="60%"
					bgGradient="radial(circle, blue.200 0%, transparent 70%)"
					opacity="0.3"
					animate={{
						rotate: [360, 0],
						scale: [1, 1.3, 1],
					}}
					transition={{
						duration: 40,
						repeat: Infinity,
						ease: "linear",
					}}
				/>
				{/* 追加装飾 */}
				{[...Array(6)].map((_, i) => (
					<MotionBox
						key={i}
						position="absolute"
						top={`${Math.random() * 100}%`}
						left={`${Math.random() * 100}%`}
						width="100px"
						height="100px"
						bgGradient={`radial(circle, ${["teal", "purple", "blue", "pink", "orange", "green"][i]}.200 0%, transparent 70%)`}
						opacity="0.2"
						animate={{
							y: [0, -30, 0],
							x: [0, 20, 0],
							scale: [1, 1.1, 1],
						}}
						transition={{
							duration: 8 + Math.random() * 4,
							repeat: Infinity,
							ease: "easeInOut",
							delay: Math.random() * 2,
						}}
					/>
				))}
			</Box>

			<Container maxW={containerMaxW} position="relative" zIndex="1">
				{/* ヒーローセクション */}
				<MotionBox
					as="section"
					minH="100vh"
					display="flex"
					alignItems="center"
					justifyContent="center"
					initial="initial"
					animate="animate"
					variants={staggerContainer}
				>
					<VStack spacing={8} textAlign="center" py={20}>
						{/* メインキャッチコピー */}
						<MotionHeading
							variants={fadeInUp}
							size="4xl"
							bgGradient={heroGradient}
							bgClip="text"
							fontWeight="extrabold"
							lineHeight="shorter"
							maxW="4xl"
						>
							福島のこころで
							<br />
							AIと出会う福島の物語 🌸
						</MotionHeading>

						<MotionText
							variants={fadeInUp}
							fontSize="2xl"
							color="gray.600"
							maxW="3xl"
							lineHeight="tall"
							fontWeight="medium"
						>
							AIで蘇った福島の魅力的な人々と会話して、
							<br />
							福島の文化や歴史、日常を深く知る体験をしませんか
						</MotionText>

						{/* 特徴バッジ */}
						<MotionBox variants={fadeInUp}>
							<HStack spacing={4} wrap="wrap" justify="center">
								{[
									{
										icon: MdVerifiedUser,
										text: "本人確認済み",
										color: "green",
									},
									{ icon: MdSecurity, text: "安全・安心", color: "blue" },
									{ icon: MdGroup, text: "10万人が利用", color: "purple" },
									{ icon: MdLocationOn, text: "福島限定", color: "teal" },
								].map((badge, index) => (
									<MotionBox
										key={index}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Badge
											colorScheme={badge.color}
											variant="solid"
											px={4}
											py={2}
											borderRadius="full"
											fontSize="sm"
											fontWeight="bold"
										>
											<HStack spacing={2}>
												<Icon as={badge.icon} />
												<Text>{badge.text}</Text>
											</HStack>
										</Badge>
									</MotionBox>
								))}
							</HStack>
						</MotionBox>

						{/* CTAボタン */}
						<MotionBox variants={fadeInUp}>
							<Stack direction={heroButtonDirection} spacing={6} pt={4}>
								<MotionBox
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										size={heroButtonSize}
										bgGradient="linear(to-r, purple.500, blue.500)"
										color="white"
										rightIcon={<FaUserPlus />}
										onClick={() => navigate("/register")}
										borderRadius="2xl"
										px={8}
										py={6}
										fontSize="xl"
										fontWeight="bold"
										shadow="2xl"
										_hover={{
											bgGradient: "linear(to-r, purple.600, blue.600)",
											shadow: "3xl",
										}}
									>
										無料で始める
									</Button>
								</MotionBox>

								<MotionBox
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										size={heroButtonSize}
										variant="outline"
										borderColor="purple.500"
										color="purple.500"
										rightIcon={<FaSignInAlt />}
										onClick={() => navigate("/login")}
										borderRadius="2xl"
										px={8}
										py={6}
										fontSize="xl"
										fontWeight="bold"
										borderWidth="2px"
										_hover={{
											bg: "purple.500",
											color: "white",
											borderColor: "purple.500",
										}}
									>
										ログイン
									</Button>
								</MotionBox>
							</Stack>
						</MotionBox>

						{/* スクロール促進 */}
						<MotionBox
							variants={fadeInUp}
							pt={8}
							animate={{
								y: [0, 10, 0],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							<VStack spacing={2}>
								<Text fontSize="sm" color="gray.500">
									もっと詳しく見る
								</Text>
								<Icon as={FaChevronDown} color="gray.400" boxSize={6} />
							</VStack>
						</MotionBox>
					</VStack>
				</MotionBox>

				{/* プロダクト詳細セクション */}
				<MotionBox
					as="section"
					py={20}
					bg={sectionBg}
					borderRadius="3xl"
					mx={-8}
					px={8}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					<VStack spacing={16}>
						<MotionBox variants={fadeInUp} textAlign="center">
							<Heading size="2xl" mb={4}>
								福島のこころで体験できること 🎁
							</Heading>
							<Text fontSize="xl" color="gray.600" maxW="4xl">
								AIで再現された福島の魅力的な人々との会話を通じて、親密度を上げることで福島の深い魅力が届きます
							</Text>
						</MotionBox>

						<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} w="full">
							{[
								{
									icon: FaComment,
									title: "AIキャラクターとの深い対話",
									benefit: "福島の人々の心に触れる会話体験",
									description:
										"福島で生きる人々の想いや体験をAIが忠実に再現。会話を重ねることで、その人の人生観や福島への愛が伝わってきます。",
									features: [
										"個性豊かなAIキャラクター",
										"親密度システムで関係性が深化",
										"福島弁での自然な会話",
									],
									color: "blue",
									gradient: "linear(to-br, blue.400, teal.400)",
								},
								{
									icon: FaMountain,
									title: "福島の歴史・文化の生きた学び",
									benefit: "教科書では知れない福島のリアルな物語",
									description:
										"会津の武士道精神、相馬野馬追いの伝統、震災からの復興など、福島の歴史をキャラクターの体験談として学べます。",
									features: [
										"歴史的人物との対話",
										"文化的背景の深い理解",
										"時代を超えた知恵の継承",
									],
									color: "purple",
									gradient: "linear(to-br, purple.400, blue.400)",
								},
								{
									icon: FaLeaf,
									title: "四季の福島を肌で感じる",
									benefit: "季節ごとの福島の美しさと暮らし",
									description:
										"桜前線の北上、夏祭りの熱気、紅葉の絶景、雪国の厳しさと温かさ。福島の四季をキャラクターと一緒に体感できます。",
									features: [
										"季節連動の会話内容",
										"地域の風物詩の紹介",
										"旬の食材・料理の話題",
									],
									color: "green",
									gradient: "linear(to-br, green.400, teal.400)",
								},
								{
									icon: FaGift,
									title: "隠れた福島の魅力発見",
									benefit: "地元の人だけが知る特別な福島",
									description:
										"観光ガイドには載らない隠れスポット、代々受け継がれる家庭料理のレシピ、地元民の暮らしの知恵を教わります。",
									features: [
										"秘密のスポット情報",
										"家庭料理のレシピ",
										"地元民の生活の知恵",
									],
									color: "orange",
									gradient: "linear(to-br, orange.400, yellow.400)",
								},
							].map((product, index) => (
								<MotionCard
									key={index}
									variants={fadeInUp}
									{...scaleOnHover}
									bg={cardBg}
									borderRadius="2xl"
									shadow="xl"
									border="1px solid"
									borderColor="gray.200"
									overflow="hidden"
									p={8}
								>
									<VStack spacing={6} align="start">
										<HStack spacing={4}>
											<Circle
												size="60px"
												bgGradient={product.gradient}
												color="white"
												shadow="lg"
											>
												<Icon as={product.icon} boxSize={6} />
											</Circle>
											<VStack align="start" spacing={1}>
												<Heading size="lg" color="gray.800">
													{product.title}
												</Heading>
												<Text
													color={`${product.color}.600`}
													fontWeight="bold"
													fontSize="md"
												>
													✨ {product.benefit}
												</Text>
											</VStack>
										</HStack>

										<Text color="gray.700" lineHeight="tall" fontSize="md">
											{product.description}
										</Text>

										<VStack align="start" spacing={3} w="full">
											<Text fontWeight="bold" color="gray.800" fontSize="sm">
												🎯 具体的な機能：
											</Text>
											{product.features.map((feature, idx) => (
												<HStack key={idx} spacing={2} align="start">
													<Icon
														as={FaCheck}
														color={`${product.color}.500`}
														mt={0.5}
														boxSize={3}
													/>
													<Text fontSize="sm" color="gray.600">
														{feature}
													</Text>
												</HStack>
											))}
										</VStack>
									</VStack>
								</MotionCard>
							))}
						</SimpleGrid>
					</VStack>
				</MotionBox>

				{/* 使い方ガイドセクション */}
				<MotionBox
					as="section"
					py={20}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					<VStack spacing={16}>
						<MotionBox variants={fadeInUp} textAlign="center">
							<Heading size="2xl" mb={4}>
								3ステップで始める福島のこころ 📱
							</Heading>
							<Text fontSize="xl" color="gray.600" maxW="3xl">
								簡単な登録で、すぐにAIで再現された福島の人々との深い対話が始まります
							</Text>
						</MotionBox>

						<SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
							{[
								{
									step: "1",
									title: "キャラクターを選ぶ",
									description:
										"福島の各地域から、興味のある人物・時代・職業のAIキャラクターを選択",
									icon: FaUsers,
									color: "blue",
									details: [
										"多様な背景のキャラクター",
										"地域・時代・職業で選択",
										"それぞれの人生ストーリー",
									],
								},
								{
									step: "2",
									title: "会話で親密度を深める",
									description:
										"日常会話から深い話まで、AIキャラクターとの対話を通じて関係性を築く",
									icon: FaComment,
									color: "purple",
									details: [
										"自然な会話システム",
										"親密度レベルの向上",
										"個人的な体験談の共有",
									],
								},
								{
									step: "3",
									title: "福島の魅力を発見",
									description:
										"親密度が上がるほど、より深い福島の文化や隠れた魅力を教えてもらえる",
									icon: FaGift,
									color: "red",
									details: [
										"段階的な情報開放",
										"特別なエピソード",
										"福島の深い魅力発見",
									],
								},
							].map((step, index) => (
								<MotionCard
									key={index}
									variants={fadeInUp}
									{...scaleOnHover}
									bg={cardBg}
									borderRadius="2xl"
									shadow="lg"
									border="1px solid"
									borderColor="gray.200"
									overflow="hidden"
									position="relative"
								>
									{/* ステップ番号 */}
									<Box
										position="absolute"
										top="-15px"
										left="50%"
										transform="translateX(-50%)"
										bg={`${step.color}.500`}
										color="white"
										borderRadius="full"
										w="40px"
										h="40px"
										display="flex"
										alignItems="center"
										justifyContent="center"
										fontWeight="bold"
										fontSize="lg"
										shadow="lg"
									>
										{step.step}
									</Box>

									<CardBody p={8} pt={12}>
										<VStack spacing={4} textAlign="center">
											<Circle
												size="80px"
												bg={`${step.color}.100`}
												color={`${step.color}.600`}
											>
												<Icon as={step.icon} boxSize={8} />
											</Circle>
											<Heading size="lg" color="gray.800">
												{step.title}
											</Heading>
											<Text color="gray.600" lineHeight="tall">
												{step.description}
											</Text>
											<VStack spacing={2} mt={4}>
												{step.details.map((detail, idx) => (
													<HStack key={idx} spacing={2}>
														<Icon
															as={FaCheck}
															color={`${step.color}.500`}
															boxSize={3}
														/>
														<Text fontSize="sm" color="gray.500">
															{detail}
														</Text>
													</HStack>
												))}
											</VStack>
										</VStack>
									</CardBody>
								</MotionCard>
							))}
						</SimpleGrid>
					</VStack>
				</MotionBox>

				{/* 特徴セクション */}
				<MotionBox
					as="section"
					py={20}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					<VStack spacing={16}>
						<MotionBox variants={fadeInUp} textAlign="center">
							<Heading size="2xl" mb={4}>
								なぜ福島のこころが選ばれるのか 💖
							</Heading>
							<Text fontSize="xl" color="gray.600" maxW="3xl">
								福島の魅力を知り尽くした私たちだからこそ提供できる、
								特別な出会いの体験をご紹介します
							</Text>
						</MotionBox>

						<SimpleGrid columns={gridColumns} spacing={8} w="full">
							{[
								{
									icon: FaHeart,
									title: "真剣な出会い",
									description:
										"遊びではなく、真剣に恋愛や結婚を考える福島の方々との素敵な出会いをサポート",
									color: "red",
									gradient: "linear(to-br, red.400, pink.400)",
								},
								{
									icon: FaMapMarkerAlt,
									title: "地域密着型",
									description:
										"福島県内に特化することで、地元愛溢れる素敵な方々と確実に出会える",
									color: "blue",
									gradient: "linear(to-br, blue.400, teal.400)",
								},
								{
									icon: FaShieldAlt,
									title: "安心・安全",
									description:
										"24時間監視体制と本人確認システムで、安心してご利用いただける環境",
									color: "green",
									gradient: "linear(to-br, green.400, teal.400)",
								},
								{
									icon: FaUsers,
									title: "温かいコミュニティ",
									description:
										"福島の人柄の良さを活かした、温かく支え合うコミュニティ文化",
									color: "orange",
									gradient: "linear(to-br, orange.400, yellow.400)",
								},
								{
									icon: FaMountain,
									title: "自然豊かな福島",
									description:
										"美しい自然に囲まれた福島で、季節を感じながらの素敵なデート",
									color: "purple",
									gradient: "linear(to-br, purple.400, blue.400)",
								},
								{
									icon: FaGift,
									title: "特別な体験",
									description:
										"福島ならではのイベントや体験を通じて、特別な思い出を一緒に作る",
									color: "pink",
									gradient: "linear(to-br, pink.400, purple.400)",
								},
							].map((feature, index) => (
								<MotionCard
									key={index}
									variants={fadeInUp}
									{...scaleOnHover}
									bg={cardBg}
									borderRadius="2xl"
									shadow="xl"
									border="1px solid"
									borderColor="gray.200"
									overflow="hidden"
									cursor="pointer"
								>
									<CardBody p={8}>
										<VStack spacing={4} textAlign="center">
											<Circle
												size="80px"
												bgGradient={feature.gradient}
												color="white"
												shadow="lg"
											>
												<Icon as={feature.icon} boxSize={8} />
											</Circle>
											<Heading size="lg" color="gray.800">
												{feature.title}
											</Heading>
											<Text color="gray.600" lineHeight="tall" fontSize="md">
												{feature.description}
											</Text>
										</VStack>
									</CardBody>
								</MotionCard>
							))}
						</SimpleGrid>
					</VStack>
				</MotionBox>

				{/* 統計セクション - 超豪華版 */}
				<MotionBox
					as="section"
					py={24}
					bg="linear-gradient(45deg, #0F0C29 0%, #302B63 50%, #24243e 100%)"
					position="relative"
					overflow="hidden"
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					{/* 3D効果の背景 */}
					<Box position="absolute" inset="0">
						{[...Array(30)].map((_, i) => (
							<MotionBox
								key={i}
								position="absolute"
								top={`${Math.random() * 100}%`}
								left={`${Math.random() * 100}%`}
								width={`${4 + Math.random() * 8}px`}
								height={`${4 + Math.random() * 8}px`}
								bg={`${["purple", "blue", "teal", "pink"][Math.floor(Math.random() * 4)]}.400`}
								borderRadius="full"
								opacity="0.6"
								animate={{
									y: [0, -100, 0],
									x: [0, Math.random() * 100 - 50, 0],
									scale: [1, 1.5, 1],
									opacity: [0.6, 0.9, 0.6],
								}}
								transition={{
									duration: 8 + Math.random() * 4,
									repeat: Infinity,
									ease: "easeInOut",
									delay: Math.random() * 5,
								}}
							/>
						))}
					</Box>

					<Container maxW={containerMaxW} position="relative" zIndex="1">
						<VStack spacing={16}>
							<MotionBox variants={fadeInUp} textAlign="center">
								<Badge
									bgGradient="linear(to-r, gold, yellow.400)"
									color="black"
									variant="solid"
									px={6}
									py={3}
									borderRadius="full"
									mb={6}
									fontSize="lg"
									fontWeight="bold"
									shadow="2xl"
								>
									🏆 IMPRESSIVE STATISTICS
								</Badge>
								<Heading size="3xl" mb={6} color="white" textShadow="2xl">
									圧倒的な実績と信頼 ⚡
								</Heading>
								<Text fontSize="xl" color="white" maxW="4xl" opacity="0.9">
									数字が証明する、福島のこころの驚異的な成果
								</Text>
							</MotionBox>

							<SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full">
								{[
									{
										number: "50,000+",
										label: "AIキャラクター体験者",
										icon: FaUsers,
										color: "purple",
										gradient: "linear(to-br, purple.400, pink.500)",
										description: "全国から愛用",
									},
									{
										number: "850+",
										label: "個性豊かなキャラクター",
										icon: FaHeart,
										color: "red",
										gradient: "linear(to-br, red.400, orange.500)",
										description: "各地域・時代を再現",
									},
									{
										number: "97.8%",
										label: "学習満足度",
										icon: FaStar,
										color: "yellow",
										gradient: "linear(to-br, yellow.400, orange.400)",
										description: "期待を超える体験",
									},
									{
										number: "24H",
										label: "いつでも対話可能",
										icon: FaBolt,
										color: "blue",
										gradient: "linear(to-br, blue.400, teal.500)",
										description: "365日サポート",
									},
								].map((stat, index) => (
									<MotionCard
										key={index}
										variants={fadeInUp}
										whileHover={{
											scale: 1.08,
											rotateY: 10,
											transition: { duration: 0.3 },
										}}
										bg="whiteAlpha.100"
										backdropFilter="blur(20px)"
										borderRadius="2xl"
										border="2px solid"
										borderColor="whiteAlpha.200"
										overflow="hidden"
										position="relative"
										shadow="2xl"
									>
										{/* 光る効果 */}
										<Box
											position="absolute"
											top="-50%"
											left="-50%"
											width="200%"
											height="200%"
											bgGradient={stat.gradient}
											opacity="0.1"
											animate={{
												rotate: [0, 360],
											}}
											transition={{
												duration: 20,
												repeat: Infinity,
												ease: "linear",
											}}
										/>

										<CardBody p={8} textAlign="center" position="relative">
											<VStack spacing={4}>
												<Circle
													size="80px"
													bgGradient={stat.gradient}
													shadow="2xl"
													animate={{
														boxShadow: [
															`0 0 20px ${stat.color}.400`,
															`0 0 40px ${stat.color}.600`,
															`0 0 20px ${stat.color}.400`,
														],
													}}
													transition={{
														duration: 3,
														repeat: Infinity,
														ease: "easeInOut",
													}}
												>
													<Icon as={stat.icon} boxSize={8} color="white" />
												</Circle>

												<VStack spacing={1}>
													<Text
														fontSize="4xl"
														fontWeight="black"
														bgGradient={stat.gradient}
														bgClip="text"
														textShadow="xl"
													>
														{stat.number}
													</Text>
													<Text
														color="gray.100"
														fontWeight="bold"
														fontSize="lg"
													>
														{stat.label}
													</Text>
													<Text color="gray.300" fontSize="sm">
														{stat.description}
													</Text>
												</VStack>
											</VStack>
										</CardBody>
									</MotionCard>
								))}
							</SimpleGrid>

							{/* 追加の豪華な統計情報 */}
							<MotionBox variants={fadeInUp} w="full">
								<Card
									bg="whiteAlpha.100"
									backdropFilter="blur(15px)"
									borderRadius="2xl"
									border="1px solid"
									borderColor="whiteAlpha.200"
								>
									<CardBody p={8}>
										<VStack spacing={6}>
											<Heading size="lg" color="gray.100" textAlign="center">
												🎯 詳細パフォーマンス指標
											</Heading>
											<SimpleGrid
												columns={{ base: 1, md: 3 }}
												spacing={8}
												w="full"
											>
												{[
													{
														metric: "平均対話継続時間",
														value: "3.2時間",
														change: "+127%",
													},
													{
														metric: "福島知識習得率",
														value: "89.4%",
														change: "+156%",
													},
													{
														metric: "リピート利用率",
														value: "94.7%",
														change: "+98%",
													},
												].map((metric, index) => (
													<VStack key={index} spacing={2}>
														<Text color="gray.300" fontSize="sm">
															{metric.metric}
														</Text>
														<Text
															fontSize="2xl"
															fontWeight="bold"
															color="gray.100"
														>
															{metric.value}
														</Text>
														<Badge
															colorScheme="green"
															variant="solid"
															borderRadius="full"
														>
															📈 {metric.change}
														</Badge>
													</VStack>
												))}
											</SimpleGrid>
										</VStack>
									</CardBody>
								</Card>
							</MotionBox>
						</VStack>
					</Container>
				</MotionBox>

				{/* ユーザーの声セクション - プレミアム版 */}
				<MotionBox
					as="section"
					py={24}
					bg="linear-gradient(135deg, purple.900 0%, blue.900 50%, teal.900 100%)"
					position="relative"
					overflow="hidden"
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					{/* 高級感のある背景装飾 */}
					<Box position="absolute" inset="0" opacity="0.1">
						{[...Array(20)].map((_, i) => (
							<MotionBox
								key={i}
								position="absolute"
								top={`${Math.random() * 100}%`}
								left={`${Math.random() * 100}%`}
								width="2px"
								height="2px"
								bg="white"
								borderRadius="full"
								animate={{
									opacity: [0, 1, 0],
									scale: [0, 1, 0],
								}}
								transition={{
									duration: 3 + Math.random() * 2,
									repeat: Infinity,
									delay: Math.random() * 3,
								}}
							/>
						))}
					</Box>

					<Container maxW={containerMaxW} position="relative" zIndex="1">
						<VStack spacing={16}>
							<MotionBox variants={fadeInUp} textAlign="center">
								<Badge
									colorScheme="yellow"
									variant="solid"
									px={4}
									py={2}
									borderRadius="full"
									mb={4}
									fontSize="sm"
									fontWeight="bold"
								>
									✨ PREMIUM TESTIMONIALS
								</Badge>
								<Heading size="3xl" mb={6} color="black" textShadow="lg">
									福島の心を体験した人々の声 💎
								</Heading>
								<Text fontSize="xl" color="black" maxW="4xl">
									AIキャラクターとの対話を通じて、福島の深い魅力を発見した体験談
								</Text>
							</MotionBox>

							<SimpleGrid columns={testimonialColumns} spacing={10} w="full">
								{[
									{
										name: "田中 美咲さん",
										age: "28歳",
										location: "東京都（福島出身）",
										avatar: "🌸",
										character: "会津の武家の娘",
										content:
											"故郷を離れて10年、福島のことを忘れかけていました。でも会津の武家の娘のAIと話すうちに、祖母から聞いた昔話や、会津の誇り高い精神を思い出しました。涙が止まりませんでした。",
										rating: 5,
										bgGradient: "linear(to-br, pink.500, purple.600)",
										achievement: "親密度MAX達成",
									},
									{
										name: "佐藤 健太さん",
										age: "34歳",
										location: "福島市",
										avatar: "🍑",
										character: "桃農家のおじいちゃん",
										content:
											"桃農家のAIおじいちゃんから、桃作りの苦労や喜び、福島の桃への誇りを聞きました。同じ福島に住んでいても知らないことばかり。福島がもっと好きになりました。",
										rating: 5,
										bgGradient: "linear(to-br, orange.400, red.500)",
										achievement: "隠しエピソード解放",
									},
									{
										name: "高橋 ゆりさん",
										age: "22歳",
										location: "いわき市",
										avatar: "🌊",
										character: "漁師のおかみさん",
										content:
											"いわきの漁師のおかみさんとの会話で、震災の時の話や海への想いを聞かせてもらいました。福島の強さと優しさを改めて感じ、地元への愛がより深くなりました。",
										rating: 5,
										bgGradient: "linear(to-br, blue.400, teal.500)",
										achievement: "特別な思い出共有",
									},
									{
										name: "鈴木 雄大さん",
										age: "31歳",
										location: "会津若松市",
										avatar: "⚔️",
										character: "白虎隊の隊士",
										content:
											"白虎隊の隊士との対話は圧巻でした。教科書では学べない、当時の想いや会津魂を直接聞けるなんて。福島の歴史への理解が格段に深まりました。",
										rating: 5,
										bgGradient: "linear(to-br, gray.600, purple.700)",
										achievement: "歴史の証人",
									},
								].map((testimonial, index) => (
									<MotionCard
										key={index}
										variants={fadeInUp}
										whileHover={{
											scale: 1.02,
											rotateY: 5,
											transition: { duration: 0.3 },
										}}
										bg="whiteAlpha.100"
										backdropFilter="blur(20px)"
										borderRadius="2xl"
										border="1px solid"
										borderColor="whiteAlpha.200"
										overflow="hidden"
										position="relative"
										shadow="2xl"
									>
										{/* グラデーション装飾 */}
										<Box
											position="absolute"
											top="0"
											left="0"
											right="0"
											height="4px"
											bgGradient={testimonial.bgGradient}
										/>

										<CardBody p={8}>
											<VStack spacing={6} align="start">
												<HStack spacing={4} w="full">
													<Circle
														size="80px"
														bgGradient={testimonial.bgGradient}
														color="white"
														shadow="xl"
														fontSize="2xl"
													>
														{testimonial.avatar}
													</Circle>
													<VStack align="start" spacing={2} flex="1">
														<Text fontWeight="bold" fontSize="xl" color="black">
															{testimonial.name}
														</Text>
														<Text fontSize="sm" color="black">
															{testimonial.age} • {testimonial.location}
														</Text>
														<Badge
															colorScheme="teal"
															variant="solid"
															borderRadius="full"
															fontSize="xs"
														>
															対話相手: {testimonial.character}
														</Badge>
														<HStack spacing={1}>
															{[...Array(testimonial.rating)].map((_, i) => (
																<Icon
																	key={i}
																	as={FaStar}
																	color="yellow.300"
																	boxSize={4}
																/>
															))}
														</HStack>
													</VStack>
												</HStack>

												<Box
													bg="blackAlpha.300"
													borderRadius="xl"
													p={4}
													borderLeft="4px solid"
													borderColor="purple.400"
													border="1px solid"
													borderColor="whiteAlpha.300"
												>
													<Text
														color="black"
														lineHeight="tall"
														fontSize="md"
														fontWeight="medium"
													>
														"{testimonial.content}"
													</Text>
												</Box>

												<HStack spacing={2}>
													<Icon as={FaCrown} color="yellow.300" boxSize={4} />
													<Text
														fontSize="sm"
														color="yellow.200"
														fontWeight="bold"
													>
														🏆 {testimonial.achievement}
													</Text>
												</HStack>
											</VStack>
										</CardBody>
									</MotionCard>
								))}
							</SimpleGrid>

							{/* 統計情報バー */}
							<MotionBox variants={fadeInUp} w="full">
								<Card
									bg="whiteAlpha.100"
									backdropFilter="blur(10px)"
									borderRadius="2xl"
								>
									<CardBody p={6}>
										<SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
											{[
												{
													label: "平均対話時間",
													value: "2.5時間",
													icon: FaComment,
												},
												{ label: "平均親密度", value: "87%", icon: FaHeart },
												{ label: "満足度", value: "98%", icon: FaStar },
												{ label: "リピート率", value: "94%", icon: FaRocket },
											].map((stat, index) => (
												<VStack key={index} spacing={2}>
													<Icon as={stat.icon} color="blue.600" boxSize={6} />
													<Text
														fontSize="2xl"
														fontWeight="bold"
														color="gray.800"
													>
														{stat.value}
													</Text>
													<Text
														fontSize="sm"
														color="gray.600"
														textAlign="center"
													>
														{stat.label}
													</Text>
												</VStack>
											))}
										</SimpleGrid>
									</CardBody>
								</Card>
							</MotionBox>
						</VStack>
					</Container>
				</MotionBox>

				{/* 最終CTAセクション */}
				<MotionBox
					as="section"
					py={20}
					textAlign="center"
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					<VStack spacing={8}>
						<MotionBox variants={fadeInUp}>
							<Heading size="3xl" mb={4}>
								今すぐ始めよう 🚀
							</Heading>
							<Text fontSize="2xl" color="gray.600" maxW="4xl">
								福島のこころで、あなたの人生を変える
								<br />
								特別な出会いが待っています
							</Text>
						</MotionBox>

						<MotionBox variants={fadeInUp}>
							<Stack direction={heroButtonDirection} spacing={6} pt={4}>
								<MotionBox
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										size="xl"
										bgGradient="linear(to-r, purple.500, blue.500, teal.500)"
										color="white"
										rightIcon={<FaRocket />}
										onClick={() => navigate("/register")}
										borderRadius="2xl"
										px={12}
										py={8}
										fontSize="2xl"
										fontWeight="bold"
										shadow="2xl"
										_hover={{
											bgGradient:
												"linear(to-r, purple.600, blue.600, teal.600)",
											shadow: "3xl",
											transform: "translateY(-2px)",
										}}
									>
										無料で登録する
									</Button>
								</MotionBox>
							</Stack>
						</MotionBox>

						<MotionBox variants={fadeInUp}>
							<Text color="gray.500" fontSize="sm">
								※ 登録は完全無料です。クレジットカード不要。
							</Text>
						</MotionBox>
					</VStack>
				</MotionBox>

				{/* フッター */}
				<Box py={12} textAlign="center" borderTop="1px" borderColor="gray.200">
					<VStack spacing={4}>
						<Text
							fontSize="2xl"
							fontWeight="bold"
							bgGradient={heroGradient}
							bgClip="text"
						>
							福島のこころ 🌸
						</Text>
						<Text color="gray.500">福島で出会い、福島で愛を育む</Text>
						<HStack spacing={6}>
							<Text fontSize="sm" color="gray.400">
								© 2024 福島のこころ
							</Text>
							<Text fontSize="sm" color="gray.400">
								プライバシーポリシー
							</Text>
							<Text fontSize="sm" color="gray.400">
								利用規約
							</Text>
						</HStack>
					</VStack>
				</Box>
			</Container>
		</Box>
	);
};

export default LandingPage;
