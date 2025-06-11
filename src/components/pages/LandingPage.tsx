import {
	Badge,
	Box,
	Button,
	Card,
	CardBody,
	Circle,
	Container,
	HStack,
	Heading,
	Icon,
	SimpleGrid,
	Stack,
	Text,
	VStack,
	useBreakpointValue,
	useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";
import {
	FaBolt,
	FaCheck,
	FaChevronDown,
	FaChevronUp,
	FaComment,
	FaCrown,
	FaGift,
	FaHeart,
	FaLeaf,
	FaMapMarkerAlt,
	FaMountain,
	FaRocket,
	FaShieldAlt,
	FaSignInAlt,
	FaStar,
	FaUserPlus,
	FaUsers,
} from "react-icons/fa";
import {
	MdGroup,
	MdLocationOn,
	MdSecurity,
	MdVerifiedUser,
} from "react-icons/md";
import { useNavigate } from "react-router";

import { isLoggedInAtom } from "@/lib/atom/AuthAtom";
import { useAtomValue } from "jotai";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

/**
 * おふくわけ - 最高品質のランディングページ
 * 誰もが魅力を感じる圧倒的なLPを実現
 */
const LandingPage: React.FC = () => {
	const navigate = useNavigate();

	const isLoggedIn = useAtomValue(isLoggedInAtom);

	// レスポンシブデザイン
	const containerMaxW = useBreakpointValue({
		base: "full",
		md: "container.xl",
	});
	const heroButtonSize = useBreakpointValue({ base: "lg", md: "xl" });
	const heroButtonDirection = useBreakpointValue({
		base: "column",
		md: "row",
	}) as "column" | "row";
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

	// Static keys for decorative elements
	const decorationKeys = Array.from({ length: 6 }, (_, i) => `decoration-${i}`);
	const particleKeys = Array.from({ length: 30 }, (_, i) => `particle-${i}`);
	const starKeys = Array.from({ length: 20 }, (_, i) => `star-${i}`);

	// トップに戻るボタンの表示制御
	const [showScrollTop, setShowScrollTop] = useState(false);
	useEffect(() => {
		const onScroll = () => {
			setShowScrollTop(window.scrollY > 800);
		};
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// ログインしている場合はホームへ
	useEffect(() => {
		if (isLoggedIn) {
			navigate("/home");
		}
	}, [isLoggedIn, navigate]);

	const handleScrollTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<Box minH="100vh" bg={bgGradient} position="relative" overflow="hidden">
			{/* トップに戻るボタン */}
			{showScrollTop && (
				<Button
					position="fixed"
					bottom={{ base: 6, md: 10 }}
					right={{ base: 6, md: 10 }}
					zIndex="popover"
					colorScheme="purple"
					borderRadius="full"
					size="lg"
					shadow="xl"
					onClick={handleScrollTop}
					leftIcon={<FaChevronUp />}
					bgGradient="linear(to-r, purple.500, blue.500)"
					_hover={{
						bgGradient: "linear(to-r, purple.600, blue.600)",
						transform: "translateY(-2px) scale(1.08)",
					}}
					aria-label="トップに戻る"
				>
					トップへ
				</Button>
			)}
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
						repeat: Number.POSITIVE_INFINITY,
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
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
				{/* 追加装飾 */}
				{decorationKeys.map((key, i) => (
					<MotionBox
						key={key}
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
							repeat: Number.POSITIVE_INFINITY,
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
						{/* ロゴ */}
						<MotionBox variants={fadeInUp} mb={6}>
							<Box
								as="img"
								src="/ht-sb/logo_hs.png"
								alt="おふくわけロゴ"
								height="240px"
								width="auto"
								mx="auto"
								display="block"
								onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
									e.currentTarget.style.display = "none";
								}}
							/>
						</MotionBox>

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
							福島のやさしさを、あなたにお裾分け
						</MotionHeading>

						<VStack spacing={4} maxW="4xl">
							<MotionText
								variants={fadeInUp}
								fontSize="xl"
								color="gray.700"
								lineHeight="tall"
								fontWeight="medium"
								textAlign="center"
							>
								福島県民との心温まる会話を通じて、人の優しさと地域のぬくもりを感じてみませんか？
							</MotionText>
							<MotionText
								variants={fadeInUp}
								fontSize="lg"
								color="gray.600"
								lineHeight="tall"
								textAlign="center"
							>
								信頼関係を深めることで、福島のモノをもらえたり、魅力的な観光スポットへ足を運んだりと、地域との絆を広げる特別な体験があなたを待っています。
							</MotionText>
						</VStack>

						{/* 特徴バッジ */}
						<MotionBox variants={fadeInUp}>
							<HStack spacing={4} wrap="wrap" justify="center">
								{[
									{
										icon: MdVerifiedUser,
										text: "本物の温かさ",
										color: "green",
									},
									{
										icon: MdSecurity,
										text: "試供品がもらえる！",
										color: "blue",
									},
									{
										icon: MdGroup,
										text: "多彩な県民との出会い",
										color: "purple",
									},
									{ icon: MdLocationOn, text: "福島の魅力発見", color: "teal" },
								].map((badge) => (
									<MotionBox
										key={badge.text}
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
										onClick={() => navigate(isLoggedIn ? "/home" : "/register")}
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
								repeat: Number.POSITIVE_INFINITY,
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
								おふくわけで体験できること 🎁
							</Heading>
							<Text fontSize="xl" color="gray.600" maxW="4xl">
								AIで再現された福島県民との会話を通じて信頼関係を構築し、人の温かさを体感することで実際の農産物贈り物や観光体験につながります
							</Text>
						</MotionBox>

						<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} w="full">
							{[
								{
									icon: FaComment,
									title: "AIキャラクターとの深い対話",
									benefit: "福島県民の温かさに触れる会話体験",
									description:
										"福島県民の人格をAIが忠実に再現。会話を重ねることで、その人の人柄や福島への愛、温かさが伝わってきます。",
									features: [
										"個性豊かな福島県民AIキャラクター",
										"信頼関係システムで関係性が深化",
										"福島弁での自然な会話",
									],
									color: "blue",
									gradient: "linear(to-br, blue.400, teal.400)",
								},
								{
									icon: FaMountain,
									title: "信頼関係による実際の恩恵",
									benefit: "会話だけでなく実際の農産物や観光体験",
									description:
										"信頼関係を構築することで、実際に福島の農産物贈り物を受け取ったり、観光地への特別な招待を受けることができます。",
									features: [
										"信頼レベルに応じた恩恵",
										"本物の農産物プレゼント",
										"観光地への特別招待",
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
							].map((product) => (
								<MotionCard
									key={product.title}
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
											{product.features.map((feature) => (
												<HStack key={feature} spacing={2} align="start">
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
								3ステップで始めるおふくわけ 📱
							</Heading>
							<Text fontSize="xl" color="gray.600" maxW="3xl">
								簡単な登録で、すぐにAIで再現された福島県民との深い対話が始まり、信頼関係を構築できます
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
									title: "会話で信頼関係を深める",
									description:
										"日常会話から深い話まで、福島県民AIとの対話を通じて信頼関係を築く",
									icon: FaComment,
									color: "purple",
									details: [
										"自然な会話システム",
										"信頼レベルの向上",
										"個人的な体験談の共有",
									],
								},
								{
									step: "3",
									title: "実際の恩恵を受ける",
									description:
										"信頼関係が深まるほど、農産物贈り物や観光招待などの実際の恩恵を受けられる",
									icon: FaGift,
									color: "red",
									details: [
										"段階的な恩恵アンロック",
										"農産物贈り物受け取り",
										"観光地招待の獲得",
									],
								},
							].map((step) => (
								<MotionCard
									key={step.step}
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
												{step.details.map((detail) => (
													<HStack key={detail} spacing={2}>
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
								おふくわけの魅力 💖
							</Heading>
							<Text fontSize="xl" color="gray.600" maxW="3xl">
								新しい形のコミュニケーション体験で、
								福島の魅力と人の温かさを再発見できます
							</Text>
						</MotionBox>

						<SimpleGrid columns={gridColumns} spacing={8} w="full">
							{[
								{
									icon: FaHeart,
									title: "革新的なAI対話",
									description:
										"最新のAI技術で実現する、自然で深みのある会話体験",
									color: "red",
									gradient: "linear(to-br, red.400, pink.400)",
								},
								{
									icon: FaMapMarkerAlt,
									title: "地域特化設計",
									description:
										"福島県に特化することで、地域の文化や歴史を深く体験できる",
									color: "blue",
									gradient: "linear(to-br, blue.400, teal.400)",
								},
								{
									icon: FaShieldAlt,
									title: "安全な環境",
									description:
										"プライバシーを重視した設計で、安心してご利用いただけます",
									color: "green",
									gradient: "linear(to-br, green.400, teal.400)",
								},
								{
									icon: FaUsers,
									title: "多様なキャラクター",
									description: "様々な時代・職業・地域の福島県民AIと出会えます",
									color: "orange",
									gradient: "linear(to-br, orange.400, yellow.400)",
								},
								{
									icon: FaMountain,
									title: "文化的価値",
									description:
										"福島の歴史や文化を対話を通じて学び、理解を深められます",
									color: "purple",
									gradient: "linear(to-br, purple.400, blue.400)",
								},
								{
									icon: FaGift,
									title: "新しい体験",
									description:
										"従来にない、AIとの信頼関係構築という新しい体験ができます",
									color: "pink",
									gradient: "linear(to-br, pink.400, purple.400)",
								},
							].map((feature) => (
								<MotionCard
									key={feature.title}
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

				{/* 技術的特徴セクション */}
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
						{particleKeys.map((key) => (
							<MotionBox
								key={key}
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
									repeat: Number.POSITIVE_INFINITY,
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
									bgGradient="linear(to-r, orange.400, red.400)"
									color="white"
									variant="solid"
									px={6}
									py={3}
									borderRadius="full"
									mb={6}
									fontSize="lg"
									fontWeight="bold"
									shadow="2xl"
								>
									🎁 SPECIAL REWARDS
								</Badge>
								<Heading size="3xl" mb={6} color="white" textShadow="2xl">
									人の温かさと特別な体験 ⚡
								</Heading>
								<Text fontSize="xl" color="white" maxW="4xl" opacity="0.9">
									福島県民との会話で感じる心のつながりと、信頼関係で得られる嬉しい試供品
								</Text>
							</MotionBox>

							<SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full">
								{[
									{
										title: "心の交流",
										label: "本物の福島の温かさ",
										icon: FaHeart,
										color: "red",
										gradient: "linear(to-br, red.400, pink.400)",
										description: "人と人とのつながり",
									},
									{
										title: "農家の試供品",
										label: "自慢の農産物をお裾分け",
										icon: FaGift,
										color: "orange",
										gradient: "linear(to-br, orange.400, yellow.500)",
										description: "信頼の証として",
									},
									{
										title: "地域の魅力",
										label: "隠れた福島の良さ発見",
										icon: FaStar,
										color: "blue",
										gradient: "linear(to-br, blue.400, teal.500)",
										description: "地元民だけが知る話",
									},
									{
										title: "特別招待",
										label: "とっておきの場所へご案内",
										icon: FaMountain,
										color: "green",
										gradient: "linear(to-br, green.400, teal.400)",
										description: "信頼関係の深まりで",
									},
								].map((reward) => (
									<MotionCard
										key={reward.label}
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
											bgGradient={reward.gradient}
											opacity="0.1"
											animate={{
												rotate: [0, 360],
											}}
											// @ts-ignore
											transition={{
												duration: 20,
												repeat: Number.POSITIVE_INFINITY,
												ease: "linear",
											}}
										/>

										<CardBody p={8} textAlign="center" position="relative">
											<VStack spacing={4}>
												<Circle
													size="80px"
													bgGradient={reward.gradient}
													shadow="2xl"
													animate={{
														boxShadow: [
															`0 0 20px ${reward.color}.400`,
															`0 0 40px ${reward.color}.600`,
															`0 0 20px ${reward.color}.400`,
														],
													}}
													// @ts-ignore
													transition={{
														duration: 3,
														repeat: Number.POSITIVE_INFINITY,
														ease: "easeInOut",
													}}
												>
													<Icon as={reward.icon} boxSize={8} color="white" />
												</Circle>

												<VStack spacing={1}>
													<Text
														fontSize="2xl"
														fontWeight="black"
														bgGradient={reward.gradient}
														bgClip="text"
														textShadow="xl"
													>
														{reward.title}
													</Text>
													<Text
														color="gray.100"
														fontWeight="bold"
														fontSize="md"
													>
														{reward.label}
													</Text>
													<Text color="gray.300" fontSize="sm">
														{reward.description}
													</Text>
												</VStack>
											</VStack>
										</CardBody>
									</MotionCard>
								))}
							</SimpleGrid>

							{/* 信頼レベル説明 */}
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
												💫 5段階の信頼関係システム
											</Heading>
											<SimpleGrid
												columns={{ base: 1, md: 3 }}
												spacing={8}
												w="full"
											>
												{[
													{
														level: "レベル1-2",
														stage: "出会い〜顔見知り",
														benefit: "日常会話を楽しむ",
													},
													{
														level: "レベル3-4",
														stage: "友達〜親友",
														benefit: "深い話・秘密を共有",
													},
													{
														level: "レベル5",
														stage: "家族同然",
														benefit: "贈り物・特別招待",
													},
												].map((trustLevel) => (
													<VStack key={trustLevel.level} spacing={2}>
														<Text color="gray.300" fontSize="sm">
															{trustLevel.level}
														</Text>
														<Text
															fontSize="lg"
															fontWeight="bold"
															color="gray.100"
														>
															{trustLevel.stage}
														</Text>
														<Badge
															colorScheme="orange"
															variant="solid"
															borderRadius="full"
														>
															{trustLevel.benefit}
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
								おふくわけで、福島県民との信頼関係を築く
								<br />
								温かさの体験と実際の恩恵が待っています
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
										onClick={() => navigate(isLoggedIn ? "/home" : "/register")}
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
					<VStack spacing={6}>
						{/* フッターロゴ */}
						<Box
							as="img"
							src="/ht-sb/tsunano.svg"
							alt="おふくわけロゴ"
							height="60px"
							width="auto"
							mx="auto"
							display="block"
							onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
								e.currentTarget.style.display = "none";
							}}
						/>
						<Text color="gray.500">地域との絆を広げる特別な体験</Text>
						<HStack spacing={6}>
							<Text fontSize="sm" color="gray.400">
								© 2025 おふくわけ
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
