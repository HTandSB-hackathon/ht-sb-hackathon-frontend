import {
	createAccountInPasswordAtom,
	loginInGithubAtom,
} from "@/lib/atom/AuthAtom";
import { isFirstTutorialAtom } from "@/lib/atom/BaseAtom";
import {
	Badge,
	Box,
	Button,
	Card,
	CardBody,
	Checkbox,
	Container,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Heading,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	Progress,
	Spacer,
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
	useToast,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import React, { useEffect } from "react";
import {
	FaArrowLeft,
	FaCheck,
	FaEnvelope,
	FaEye,
	FaEyeSlash,
	FaGithub,
	FaLock,
	FaRocket,
	FaShieldAlt,
	FaUser,
	FaUserPlus,
} from "react-icons/fa";
import { MdGroup, MdSpeed, MdVerifiedUser } from "react-icons/md";
import { useNavigate } from "react-router";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

/**
 * ユーザー登録ページ - 最高のデザイン
 */
const RegisterPage: React.FC = () => {
	const navigate = useNavigate();
	const toast = useToast();

	// フォーム状態
	const [formData, setFormData] = React.useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		agreeTerms: false,
		agreeMarketing: false,
	});

	const [errors, setErrors] = React.useState<Record<string, string>>({});
	const [showPassword, setShowPassword] = React.useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const createUser = useSetAtom(createAccountInPasswordAtom);
	// ステップ管理
	const steps = [
		{ title: "基本情報", description: "お名前とメールアドレス" },
		{ title: "パスワード設定", description: "安全なパスワードを作成" },
		{ title: "利用規約", description: "規約への同意" },
	];

	const { activeStep, setActiveStep } = useSteps({
		index: 0,
		count: steps.length,
	});

	// レスポンシブデザイン
	// const isMobile = useBreakpointValue({ base: true, md: false });
	const containerMaxW = useBreakpointValue({
		base: "full",
		sm: "md",
		md: "lg",
		lg: "xl",
	});
	const cardPadding = useBreakpointValue({ base: 6, md: 8, lg: 10 });

	// カラーテーマ
	const bgGradient = useColorModeValue(
		"linear(to-br, purple.50, blue.50, teal.50)",
		"linear(to-br, gray.900, purple.900, blue.900)",
	);
	const cardBg = useColorModeValue("white", "gray.800");
	const stepperBg = useColorModeValue("gray.50", "gray.700");

	// パスワード強度チェック
	const getPasswordStrength = (password: string) => {
		let strength = 0;
		if (password.length >= 8) strength += 25;
		if (/[A-Z]/.test(password)) strength += 25;
		if (/[a-z]/.test(password)) strength += 25;
		if (/[0-9]/.test(password)) strength += 25;
		return strength;
	};

	const passwordStrength = getPasswordStrength(formData.password);
	const [isFirstTutorial, setIsFirstTutorial] = useAtom(isFirstTutorialAtom);

	// バリデーション
	const validateCurrentStep = () => {
		const newErrors: Record<string, string> = {};

		if (activeStep === 0) {
			if (!formData.username) newErrors.username = "ユーザー名は必須です";
			if (formData.username.length < 3)
				newErrors.username = "ユーザー名は3文字以上で入力してください";
			if (!formData.email) newErrors.email = "メールアドレスは必須です";
			if (!/\S+@\S+\.\S+/.test(formData.email))
				newErrors.email = "有効なメールアドレスを入力してください";
		}

		if (activeStep === 1) {
			if (!formData.password) newErrors.password = "パスワードは必須です";
			if (formData.password.length < 8)
				newErrors.password = "パスワードは8文字以上で入力してください";
			if (!formData.confirmPassword)
				newErrors.confirmPassword = "パスワード確認は必須です";
			if (formData.password !== formData.confirmPassword)
				newErrors.confirmPassword = "パスワードが一致しません";
		}

		if (activeStep === 2) {
			if (!formData.agreeTerms)
				newErrors.agreeTerms = "利用規約への同意は必須です";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// フォーム送信
	const handleSubmit = async () => {
		if (!validateCurrentStep()) return;

		if (activeStep < steps.length - 1) {
			setActiveStep(activeStep + 1);
			return;
		}

		setIsLoading(true);

		try {
			// API呼び出し（モック）
			await createUser({
				email: formData.email,
				password: formData.password,
				name: formData.username,
			});

			toast({
				title: "登録完了！",
				description:
					"アカウントが正常に作成されました。ログインページに移動します。",
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			setTimeout(() => {
				navigate("/login");
			}, 1000);
		} catch (error) {
			toast({
				title: "エラーが発生しました",
				description: "登録に失敗しました。もう一度お試しください。",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const handlePrevStep = () => {
		if (activeStep > 0) {
			setActiveStep(activeStep - 1);
		} else {
			navigate("/login");
		}
	};

	const setLoginInGithub = useSetAtom(loginInGithubAtom);

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
					opacity="0.3"
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
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 25,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
			</Box>

			<Container maxW={containerMaxW} py={8} position="relative" zIndex="1">
				<VStack spacing={8} align="stretch">
					{/* ヘッダー */}
					<MotionBox
						initial={{ opacity: 0, y: -30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<Flex align="center" mb={4}>
							<Button
								leftIcon={<FaArrowLeft />}
								variant="ghost"
								onClick={() => navigate("/login")}
								borderRadius="xl"
								_hover={{ bg: "whiteAlpha.200" }}
							>
								ログインに戻る
							</Button>
							<Spacer />
							<Badge
								colorScheme="purple"
								variant="solid"
								px={3}
								py={1}
								borderRadius="full"
							>
								無料アカウント作成
							</Badge>
						</Flex>

						<VStack spacing={4} textAlign="center">
							<Box>
								<Heading
									size="2xl"
									bgGradient="linear(to-r, purple.600, blue.600, teal.500)"
									bgClip="text"
									fontWeight="extrabold"
									mb={2}
								>
									おふくわけに参加しよう 🌸
								</Heading>
								<Text
									fontSize="lg"
									color="gray.600"
									maxW="2xl"
									mx="auto"
									lineHeight="tall"
								>
									美しい福島で素敵な人々と出会い、特別なつながりを築きませんか
								</Text>
							</Box>

							{/* 特徴カード */}
							<HStack spacing={4} wrap="wrap" justify="center" mt={6}>
								{[
									{ icon: MdVerifiedUser, text: "安全・安心", color: "green" },
									{ icon: MdSpeed, text: "簡単登録", color: "blue" },
									{
										icon: MdGroup,
										text: "温かいコミュニティ",
										color: "purple",
									},
								].map((feature, index) => (
									<MotionBox
										key={index}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 + index * 0.1 }}
									>
										<Card
											size="sm"
											bg="whiteAlpha.200"
											backdropFilter="blur(10px)"
											border="1px solid"
											borderColor="whiteAlpha.300"
										>
											<CardBody p={3}>
												<HStack spacing={2}>
													<Icon
														as={feature.icon}
														color={`${feature.color}.500`}
														boxSize={4}
													/>
													<Text
														fontSize="sm"
														fontWeight="medium"
														color="gray.700"
													>
														{feature.text}
													</Text>
												</HStack>
											</CardBody>
										</Card>
									</MotionBox>
								))}
							</HStack>
						</VStack>
					</MotionBox>

					{/* メインカード */}
					<MotionCard
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						bg={cardBg}
						borderRadius="2xl"
						shadow="2xl"
						border="1px solid"
						borderColor="gray.200"
						overflow="hidden"
					>
						{/* ステッパー */}
						<Box bg={stepperBg} p={6}>
							<Stepper index={activeStep} colorScheme="purple" size="sm">
								{steps.map((step, index) => (
									<Step key={index}>
										<StepIndicator>
											<StepStatus
												complete={<StepIcon />}
												incomplete={<StepNumber />}
												active={<StepNumber />}
											/>
										</StepIndicator>

										<Box flexShrink="0">
											<StepTitle>{step.title}</StepTitle>
											<StepDescription>{step.description}</StepDescription>
										</Box>

										<StepSeparator />
									</Step>
								))}
							</Stepper>
						</Box>

						<CardBody p={cardPadding}>
							<AnimatePresence mode="wait">
								{/* ステップ1: 基本情報 */}
								{activeStep === 0 && (
									<MotionBox
										key="step1"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.3 }}
									>
										<VStack spacing={6} align="stretch">
											<Box textAlign="center">
												<Text fontSize="2xl" mb={2}>
													👋
												</Text>
												<Heading size="lg" mb={2}>
													はじめまして！
												</Heading>
												<Text color="gray.600">
													あなたの基本情報を教えてください
												</Text>
											</Box>

											<VStack spacing={4}>
												<FormControl isInvalid={!!errors.username}>
													<FormLabel fontWeight="bold">
														<HStack>
															<Icon as={FaUser} color="purple.500" />
															<Text>ユーザー名</Text>
														</HStack>
													</FormLabel>
													<Input
														placeholder="例: 田中太郎"
														value={formData.username}
														onChange={(e) =>
															handleInputChange("username", e.target.value)
														}
														size="lg"
														borderRadius="xl"
														bg="gray.50"
														border="2px solid"
														borderColor="gray.200"
														_focus={{
															borderColor: "purple.400",
															bg: "white",
															boxShadow: "0 0 0 1px purple.400",
														}}
													/>
													<FormErrorMessage>{errors.username}</FormErrorMessage>
												</FormControl>

												<FormControl isInvalid={!!errors.email}>
													<FormLabel fontWeight="bold">
														<HStack>
															<Icon as={FaEnvelope} color="blue.500" />
															<Text>メールアドレス</Text>
														</HStack>
													</FormLabel>
													<Input
														type="email"
														placeholder="例: tanaka@example.com"
														value={formData.email}
														onChange={(e) =>
															handleInputChange("email", e.target.value)
														}
														size="lg"
														borderRadius="xl"
														bg="gray.50"
														border="2px solid"
														borderColor="gray.200"
														_focus={{
															borderColor: "blue.400",
															bg: "white",
															boxShadow: "0 0 0 1px blue.400",
														}}
													/>
													<FormErrorMessage>{errors.email}</FormErrorMessage>
												</FormControl>
											</VStack>
										</VStack>
									</MotionBox>
								)}

								{/* ステップ2: パスワード設定 */}
								{activeStep === 1 && (
									<MotionBox
										key="step2"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.3 }}
									>
										<VStack spacing={6} align="stretch">
											<Box textAlign="center">
												<Text fontSize="2xl" mb={2}>
													🔐
												</Text>
												<Heading size="lg" mb={2}>
													安全なパスワードを設定
												</Heading>
												<Text color="gray.600">
													アカウントを守るための強力なパスワードを作成してください
												</Text>
											</Box>

											<VStack spacing={4}>
												<FormControl isInvalid={!!errors.password}>
													<FormLabel fontWeight="bold">
														<HStack>
															<Icon as={FaLock} color="green.500" />
															<Text>パスワード</Text>
														</HStack>
													</FormLabel>
													<InputGroup>
														<Input
															type={showPassword ? "text" : "password"}
															placeholder="8文字以上の英数字"
															value={formData.password}
															onChange={(e) =>
																handleInputChange("password", e.target.value)
															}
															size="lg"
															borderRadius="xl"
															bg="gray.50"
															border="2px solid"
															borderColor="gray.200"
															_focus={{
																borderColor: "green.400",
																bg: "white",
																boxShadow: "0 0 0 1px green.400",
															}}
														/>
														<InputRightElement height="100%">
															<IconButton
																aria-label="toggle password visibility"
																icon={showPassword ? <FaEyeSlash /> : <FaEye />}
																variant="ghost"
																size="sm"
																onClick={() => setShowPassword(!showPassword)}
															/>
														</InputRightElement>
													</InputGroup>
													<FormErrorMessage>{errors.password}</FormErrorMessage>

													{/* パスワード強度インジケーター */}
													{formData.password && (
														<Box mt={2}>
															<Text fontSize="sm" mb={1} fontWeight="medium">
																パスワード強度:{" "}
																{passwordStrength < 50
																	? "弱い"
																	: passwordStrength < 75
																		? "普通"
																		: "強い"}
															</Text>
															<Progress
																value={passwordStrength}
																colorScheme={
																	passwordStrength < 50
																		? "red"
																		: passwordStrength < 75
																			? "yellow"
																			: "green"
																}
																size="sm"
																borderRadius="full"
															/>
														</Box>
													)}
												</FormControl>

												<FormControl isInvalid={!!errors.confirmPassword}>
													<FormLabel fontWeight="bold">
														<HStack>
															<Icon as={FaCheck} color="green.500" />
															<Text>パスワード確認</Text>
														</HStack>
													</FormLabel>
													<InputGroup>
														<Input
															type={showConfirmPassword ? "text" : "password"}
															placeholder="上記と同じパスワードを入力"
															value={formData.confirmPassword}
															onChange={(e) =>
																handleInputChange(
																	"confirmPassword",
																	e.target.value,
																)
															}
															size="lg"
															borderRadius="xl"
															bg="gray.50"
															border="2px solid"
															borderColor="gray.200"
															_focus={{
																borderColor: "green.400",
																bg: "white",
																boxShadow: "0 0 0 1px green.400",
															}}
														/>
														<InputRightElement height="100%">
															<IconButton
																aria-label="toggle confirm password visibility"
																icon={
																	showConfirmPassword ? (
																		<FaEyeSlash />
																	) : (
																		<FaEye />
																	)
																}
																variant="ghost"
																size="sm"
																onClick={() =>
																	setShowConfirmPassword(!showConfirmPassword)
																}
															/>
														</InputRightElement>
													</InputGroup>
													<FormErrorMessage>
														{errors.confirmPassword}
													</FormErrorMessage>
												</FormControl>
											</VStack>
										</VStack>
									</MotionBox>
								)}

								{/* ステップ3: 利用規約 */}
								{activeStep === 2 && (
									<MotionBox
										key="step3"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.3 }}
									>
										<VStack spacing={6} align="stretch">
											<Box textAlign="center">
												<Text fontSize="2xl" mb={2}>
													📄
												</Text>
												<Heading size="lg" mb={2}>
													利用規約への同意
												</Heading>
												<Text color="gray.600">
													サービスのご利用前に、利用規約をご確認ください
												</Text>
											</Box>

											<VStack spacing={4} align="stretch">
												<Card
													bg="purple.50"
													border="1px solid"
													borderColor="purple.200"
												>
													<CardBody p={4}>
														<VStack spacing={3} align="start">
															<HStack>
																<Icon as={FaShieldAlt} color="purple.500" />
																<Text fontWeight="bold" color="purple.700">
																	プライバシーと安全性
																</Text>
															</HStack>
															<Text fontSize="sm" color="gray.600">
																あなたの個人情報は厳重に保護され、第三者に提供されることはありません。
																安全で快適なコミュニティ作りにご協力ください。
															</Text>
														</VStack>
													</CardBody>
												</Card>

												<FormControl isInvalid={!!errors.agreeTerms}>
													<Checkbox
														isChecked={formData.agreeTerms}
														onChange={(e) =>
															handleInputChange("agreeTerms", e.target.checked)
														}
														colorScheme="purple"
														size="lg"
													>
														<Text fontSize="sm">
															<Link
																color="purple.500"
																textDecoration="underline"
																href="#"
																isExternal
															>
																利用規約
															</Link>
															および
															<Link
																color="purple.500"
																textDecoration="underline"
																href="#"
																isExternal
																ml={1}
															>
																プライバシーポリシー
															</Link>
															に同意します（必須）
														</Text>
													</Checkbox>
													<FormErrorMessage>
														{errors.agreeTerms}
													</FormErrorMessage>
												</FormControl>

												<FormControl>
													<Checkbox
														isChecked={formData.agreeMarketing}
														onChange={(e) =>
															handleInputChange(
																"agreeMarketing",
																e.target.checked,
															)
														}
														colorScheme="blue"
														size="lg"
													>
														<Text fontSize="sm" color="gray.600">
															福島の魅力やイベント情報などのお知らせメールを受け取る（任意）
														</Text>
													</Checkbox>
												</FormControl>
											</VStack>
										</VStack>
									</MotionBox>
								)}
							</AnimatePresence>

							{/* ボタンエリア */}
							<HStack spacing={4} mt={8} justify="space-between">
								<Button
									variant="outline"
									onClick={handlePrevStep}
									borderRadius="xl"
									size="lg"
									leftIcon={<FaArrowLeft />}
								>
									{activeStep === 0 ? "ログインに戻る" : "戻る"}
								</Button>

								<Spacer />

								<Button
									colorScheme="purple"
									onClick={() => {
										setIsFirstTutorial(true);
										handleSubmit();
									}}
									isLoading={isLoading}
									loadingText={
										activeStep < steps.length - 1 ? "処理中..." : "登録中..."
									}
									borderRadius="xl"
									size="lg"
									rightIcon={
										activeStep < steps.length - 1 ? (
											<FaRocket />
										) : (
											<FaUserPlus />
										)
									}
									_hover={{
										transform: "translateY(-2px)",
										boxShadow: "lg",
									}}
								>
									{activeStep < steps.length - 1 ? "次へ" : "アカウント作成"}
								</Button>
							</HStack>
						</CardBody>
					</MotionCard>

					{/* ソーシャルログイン */}
					<MotionCard
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						bg={cardBg}
						borderRadius="2xl"
						shadow="lg"
					>
						<CardBody p={6}>
							<VStack spacing={4}>
								<Text textAlign="center" color="gray.500" fontSize="sm">
									または、ソーシャルアカウントで登録
								</Text>

								<HStack spacing={4} w="full" justify="center">
									{[
										{
											icon: FaGithub,
											name: "GitHub",
											color: "gray",
											onclick: () => {
												setIsFirstTutorial(true);
												setLoginInGithub();
											},
										},
									].map((social) => (
										<Button
											key={social.name}
											leftIcon={<Icon as={social.icon} />}
											variant="outline"
											borderRadius="xl"
											onClick={() => social.onclick()}
											_hover={{
												transform: "translateY(-1px)",
												boxShadow: "md",
											}}
											flex="1"
										>
											{social.name}で登録
										</Button>
									))}
								</HStack>
							</VStack>
						</CardBody>
					</MotionCard>

					{/* フッター */}
					<Box textAlign="center" py={4}>
						<Text fontSize="sm" color="gray.500">
							すでにアカウントをお持ちですか？{" "}
							<Link
								color="purple.500"
								fontWeight="bold"
								onClick={() => navigate("/login")}
							>
								ログインはこちら
							</Link>
						</Text>
					</Box>
				</VStack>
			</Container>
		</Box>
	);
};

export default RegisterPage;
