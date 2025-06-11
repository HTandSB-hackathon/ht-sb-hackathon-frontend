"use client";

import { isLoadingAuthAtom, loginInPasswordAtom } from "@/lib/atom/AuthAtom";
import { isFirstTutorialAtom } from "@/lib/atom/BaseAtom";
import {
	Box,
	Button,
	Card,
	CardBody,
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
	Text,
	VStack,
	useBreakpointValue,
	useColorModeValue,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import {
	FaEnvelope,
	FaEye,
	FaEyeSlash,
	FaLock,
	FaSignInAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router";

const MotionCard = motion(Card);

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{},
	);

	const [isFirstTutorial, setIsFirstTutorial] = useAtom(isFirstTutorialAtom);

	const login = useSetAtom(loginInPasswordAtom);
	const setIsLoading = useSetAtom(isLoadingAuthAtom);

	const navigate = useNavigate();

	// カラーテーマ
	const cardBg = useColorModeValue("white", "gray.800");
	const cardPadding = useBreakpointValue({ base: 6, md: 8, lg: 10 });

	const validateForm = () => {
		const newErrors: { email?: string; password?: string } = {};
		if (!email) newErrors.email = "メールアドレスは必須です";
		if (!/\S+@\S+\.\S+/.test(email))
			newErrors.email = "有効なメールアドレスを入力してください";
		if (!password) newErrors.password = "パスワードは必須です";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field: string, value: string) => {
		if (field === "email") setEmail(value);
		if (field === "password") setPassword(value);

		// エラーをクリア
		if (errors[field as keyof typeof errors]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		console.log("isFirstTutorial", isFirstTutorial);

		try {
			const returnUrl = sessionStorage.getItem("returnUrl") || "/home";
			sessionStorage.removeItem("returnUrl");

			await login({ username: email, password });
			if (isFirstTutorial) {
				navigate("/tutorial");
			} else {
				navigate(returnUrl);
			}
		} catch (error) {
			console.error("Login failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<MotionCard
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			bg={cardBg}
			borderRadius="2xl"
			shadow="2xl"
			border="1px solid"
			borderColor="gray.200"
			overflow="hidden"
			maxW="md"
			w="full"
		>
			<CardBody p={cardPadding}>
				<VStack spacing={6} align="stretch">
					{/* ヘッダー */}
					<Box textAlign="center">
						<Text fontSize="3xl" mb={2}>
							🌸
						</Text>
						<Heading
							size="xl"
							bgGradient="linear(to-r, purple.600, blue.600)"
							bgClip="text"
							fontWeight="extrabold"
							mb={2}
						>
							おふくわけへログイン
						</Heading>
					</Box>

					<form>
						<VStack spacing={5}>
							{/* メールアドレス */}
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
									value={email}
									onChange={(e) => handleInputChange("email", e.target.value)}
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
								<AnimatePresence>
									{errors.email && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
										>
											<FormErrorMessage>{errors.email}</FormErrorMessage>
										</motion.div>
									)}
								</AnimatePresence>
							</FormControl>

							{/* パスワード */}
							<FormControl isInvalid={!!errors.password}>
								<FormLabel fontWeight="bold">
									<HStack>
										<Icon as={FaLock} color="purple.500" />
										<Text>パスワード</Text>
									</HStack>
								</FormLabel>
								<InputGroup>
									<Input
										type={showPassword ? "text" : "password"}
										placeholder="パスワードを入力"
										value={password}
										onChange={(e) =>
											handleInputChange("password", e.target.value)
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
								<AnimatePresence>
									{errors.password && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
										>
											<FormErrorMessage>{errors.password}</FormErrorMessage>
										</motion.div>
									)}
								</AnimatePresence>
							</FormControl>

							{/* ログインボタン */}
							<Button
								type="button"
								colorScheme="purple"
								size="lg"
								w="full"
								borderRadius="xl"
								rightIcon={<FaSignInAlt />}
								onClick={handleSubmit}
								isLoading={false}
								loadingText="ログイン中..."
								bgGradient="linear(to-r, purple.500, blue.500)"
								_hover={{
									bgGradient: "linear(to-r, purple.600, blue.600)",
									transform: "translateY(-2px)",
									boxShadow: "lg",
								}}
							>
								ログイン
							</Button>
						</VStack>
					</form>
				</VStack>
			</CardBody>
		</MotionCard>
	);
}
