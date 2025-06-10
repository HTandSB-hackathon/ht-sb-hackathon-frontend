import {
	Alert,
	AlertDescription,
	AlertIcon,
	Box,
	Button,
	Card,
	CardBody,
	Center,
	Container,
	HStack,
	Heading,
	Icon,
	Spinner,
	Text,
	VStack,
	useBreakpointValue,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	FaCheckCircle,
	FaExclamationTriangle,
	FaRocket,
	FaUser,
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router";

import { checkNFCCharacterAtom } from "@/lib/atom/CharacterAtom";
import { userAtom } from "@/lib/atom/UserAtom";
import { UserProfileMenu } from "../organisms/UserProfileMenu";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const Circle = motion(Center);

interface NFCResult {
	characterId: string;
	unlocked: boolean;
	message: string;
}

/**
 * NFC UUID読み取り結果処理ページ
 * /character/nfc?uuid=<uuid> のルーティングで呼び出される
 */
export const CharacterGetByNfcPage: React.FC = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const toast = useToast();
	const user = useAtomValue(userAtom);

	// 状態管理
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [nfcResult, setNfcResult] = useState<NFCResult | null>(null);

	const checkNfcRelationship = useSetAtom(checkNFCCharacterAtom);

	// レスポンシブデザイン
	const containerMaxW = useBreakpointValue({
		base: "full",
		sm: "md",
		md: "lg",
		lg: "xl",
	});
	const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });

	// カラーテーマ
	const bgGradient = useColorModeValue(
		"linear(to-br, blue.50, purple.50, pink.50)",
		"linear(to-br, gray.900, purple.900, blue.900)",
	);
	const cardBg = useColorModeValue("white", "gray.800");

	// モーションバリアント
	const containerVariants = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -30 },
	};

	const cardVariants = {
		initial: { opacity: 0, scale: 0.9 },
		animate: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	};

	// NFC UUID処理
	useEffect(() => {
		const processNFCUuid = async () => {
			const uuid = searchParams.get("uuid");

			if (!uuid) {
				setError("NFCタグのUUIDが見つかりません");
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);
				const relationship = await checkNfcRelationship(uuid);
				if (relationship) {
					setNfcResult({
						characterId: String(relationship.characterId),
						unlocked: true,
						message: "NFCタグを読み取りました",
					});
				}
			} catch (err) {
				console.error("NFC UUID処理エラー:", err);
				setError("NFCタグの処理中にエラーが発生しました");
				toast({
					title: "エラーが発生しました",
					description: "NFCタグの読み取りに失敗しました",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "top",
				});
			} finally {
				setIsLoading(false);
			}
		};

		processNFCUuid();
	}, [searchParams, toast]);

	// ナビゲーション関数
	const handleGoToCharacters = () => {
		navigate("/characters");
	};

	const handleGoToCharacterDetail = () => {
		if (nfcResult?.characterId) {
			navigate(`/characters/${nfcResult.characterId}`);
		}
	};

	const handleGoHome = () => {
		navigate("/home");
	};

	return (
		<Box minH="100vh" bgGradient={bgGradient} position="relative">
			<UserProfileMenu user={user} cardBg={cardBg} />

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
						scale: [1, 1.15, 1],
					}}
					transition={{
						duration: 25,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
			</Box>

			<Container
				maxW={containerMaxW}
				position="relative"
				zIndex="1"
				display="flex"
				alignItems="center"
				justifyContent="center"
				minH="100vh"
				px={containerPadding}
			>
				<MotionBox
					variants={containerVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					w="full"
					maxW="500px"
				>
					{/* メインカード */}
					<MotionCard
						variants={cardVariants}
						initial="initial"
						animate="animate"
						bg={cardBg}
						borderRadius="2xl"
						shadow="2xl"
						border="1px solid"
						borderColor="gray.200"
						overflow="hidden"
					>
						<CardBody p={8}>
							<VStack spacing={6} textAlign="center">
								{/* アイコンとタイトル */}
								<VStack spacing={4}>
									<MotionBox
										animate={{
											rotate: [0, 5, -5, 0],
											scale: [1, 1.1, 1],
										}}
										transition={{
											duration: 2,
											repeat: Number.POSITIVE_INFINITY,
											ease: "easeInOut",
										}}
									>
										<Circle
											bg="purple.100"
											color="purple.600"
											borderRadius="full"
										>
											{/* <Icon as={FaNfc} boxSize={10} /> */}
										</Circle>
									</MotionBox>

									<Heading size="lg" color="gray.800">
										NFCタグ読み取り結果
									</Heading>
								</VStack>

								{/* 処理状況表示 */}
								{isLoading && (
									<VStack spacing={4}>
										<Spinner size="lg" color="purple.500" thickness="4px" />
										<Text color="gray.600">NFCタグを処理しています...</Text>
									</VStack>
								)}

								{/* エラー表示 */}
								{error && !isLoading && (
									<Alert status="error" borderRadius="xl">
										<AlertIcon />
										<VStack align="start" spacing={1}>
											<AlertDescription fontWeight="bold">
												エラーが発生しました
											</AlertDescription>
											<AlertDescription>{error}</AlertDescription>
										</VStack>
									</Alert>
								)}

								{/* 成功時の結果表示 */}
								{nfcResult && !isLoading && !error && (
									<>
										<Alert
											status={nfcResult.unlocked ? "success" : "info"}
											borderRadius="xl"
										>
											<AlertIcon />
											<VStack align="start" spacing={1}>
												<AlertDescription fontWeight="bold">
													{nfcResult.unlocked
														? "新しいキャラクターが解放されました！"
														: "NFCタグを読み取りました"}
												</AlertDescription>
												<AlertDescription>{nfcResult.message}</AlertDescription>
											</VStack>
										</Alert>

										{/* 解放された場合の特別表示 */}
										{nfcResult.unlocked && (
											<MotionBox
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.5 }}
											>
												<Card bg="purple.50" borderRadius="xl">
													<CardBody p={6}>
														<VStack spacing={4}>
															<Icon
																as={FaCheckCircle}
																color="green.500"
																boxSize={8}
															/>
															<Text
																fontWeight="bold"
																color="purple.700"
																fontSize="lg"
															>
																🎉 おめでとうございます！
															</Text>
															<Text color="gray.600" textAlign="center">
																新しい福島の人との出会いが待っています。
																プロフィールを確認して会話を始めましょう！
															</Text>
														</VStack>
													</CardBody>
												</Card>
											</MotionBox>
										)}
									</>
								)}

								{/* アクションボタン */}
								{!isLoading && (
									<VStack spacing={4} w="full">
										{nfcResult?.unlocked && nfcResult.characterId && (
											<Button
												colorScheme="purple"
												size="lg"
												borderRadius="xl"
												leftIcon={<FaUser />}
												onClick={handleGoToCharacterDetail}
												w="full"
												_hover={{
													transform: "translateY(-2px)",
													boxShadow: "lg",
												}}
											>
												キャラクターを見る
											</Button>
										)}

										<Button
											colorScheme="blue"
											variant={nfcResult?.unlocked ? "outline" : "solid"}
											size="lg"
											borderRadius="xl"
											leftIcon={<FaRocket />}
											onClick={handleGoToCharacters}
											w="full"
											_hover={{
												transform: "translateY(-2px)",
												boxShadow: "lg",
											}}
										>
											キャラクター一覧へ
										</Button>

										<Button
											variant="ghost"
											size="md"
											onClick={handleGoHome}
											color="gray.500"
											_hover={{
												color: "gray.700",
												bg: "gray.50",
											}}
										>
											ホームへ戻る
										</Button>
									</VStack>
								)}
							</VStack>
						</CardBody>
					</MotionCard>

					{/* 追加情報カード */}
					{!isLoading && !error && (
						<MotionCard
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7 }}
							bg={cardBg}
							borderRadius="xl"
							shadow="lg"
							mt={6}
						>
							<CardBody p={6}>
								<VStack spacing={4} textAlign="center">
									<HStack>
										<Icon as={FaExclamationTriangle} color="orange.500" />
										<Text fontWeight="bold" color="gray.700">
											NFCタグについて
										</Text>
									</HStack>
									<Text fontSize="sm" color="gray.600" lineHeight="tall">
										このNFCタグは福島県内の特定の場所に設置されています。
										実際に訪れることで新しいキャラクターとの出会いや
										特別なストーリーが解放されます。
									</Text>
								</VStack>
							</CardBody>
						</MotionCard>
					)}
				</MotionBox>
			</Container>
		</Box>
	);
};

export default CharacterGetByNfcPage;
