import {
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Circle,
	Flex,
	Heading,
	IconButton,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type React from "react";
import { FaArrowRight, FaRocket } from "react-icons/fa";

const MotionCard = motion(Card);

interface TutorialStepCardProps {
	title: string;
	description: string;
	color: string;
	gradient: string;
	children: React.ReactNode;
	minHeight?: string;
	onPrev?: () => void;
	onNext?: () => void;
	showPrev?: boolean;
	showNext?: boolean;
	isLastStep?: boolean;
}

/**
 * チュートリアルステップカード分子コンポーネント
 * 各ステップの内容を表示する美しいカード
 */
export const TutorialStepCard: React.FC<TutorialStepCardProps> = ({
	title,
	description,
	gradient,
	children,
	minHeight = "700px",
	onPrev,
	onNext,
	showPrev = false,
	showNext = false,
	isLastStep = false,
}) => {
	const cardBg = useColorModeValue("whiteAlpha.200", "gray.800");

	return (
		<MotionCard
			bg={cardBg}
			backdropFilter="blur(20px)"
			borderRadius="3xl"
			shadow="dark-lg"
			border="2px solid"
			borderColor="whiteAlpha.400"
			overflow="hidden"
			minH={minHeight}
			position="relative"
			initial={{ opacity: 0, y: 50, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.8, ease: "easeOut" }}
		>
			{/* 動的グラデーションヘッダー */}
			<CardHeader
				bgGradient={gradient}
				color="white"
				py={{ base: 4, md: 8 }}
				position="relative"
				overflow="hidden"
			>
				{/* ヘッダー装飾パターン */}
				<Box
					position="absolute"
					inset="0"
					bgImage="radial-gradient(circle at 25% 25%, white 1px, transparent 1px)"
					backgroundSize="30px 30px"
					opacity="0.1"
				/>

				{/* ヘッダーコンテンツ */}
				<Flex
					position="relative"
					zIndex={2}
					w="full"
					align="center"
					justify="center"
					gap={4}
				>
					{/* 左: 戻るボタン */}
					<Box
						flex="0 0 auto"
						display="flex"
						alignItems="center"
						justifyContent="center"
					>
						{showPrev ? (
							<Circle
								size={{ base: "54px", md: "62px" }}
								bg="whiteAlpha.300"
								border="2px solid"
								boxShadow="0 0 0 4px rgba(128,90,213,0.15)"
								_hover={{ bg: "whiteAlpha.500" }}
								transition="background 0.2s"
								display="flex"
								alignItems="center"
								justifyContent="center"
							>
								<IconButton
									variant="ghost"
									colorScheme="whiteAlpha"
									aria-label="前へ"
									icon={
										<FaArrowRight
											style={{ transform: "rotate(180deg)" }}
											size={28}
										/>
									}
									onClick={onPrev}
									borderRadius="full"
									boxSize={{ base: "44px", md: "50px" }}
									minW="unset"
									p={0}
									bg="transparent"
									_hover={{
										bg: "transparent",
										transform: "translateY(-2px) scale(1.08)",
										shadow: "md",
									}}
								/>
							</Circle>
						) : (
							<Box boxSize={{ base: "54px", md: "62px" }} />
						)}
					</Box>

					{/* 中央: タイトル・説明 */}
					<Box
						flex="1 1 0%"
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						minW={0}
						px={{ base: 1, md: 0 }}
					>
						<Heading
							size="2xl"
							textShadow="lg"
							textAlign="center"
							w="full"
							whiteSpace="pre-line"
							isTruncated={false}
							fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }} // さらに大きく
						>
							{title}
						</Heading>
						<Text
							opacity="0.95"
							fontSize={{ base: "md", sm: "lg", md: "xl" }} // さらに大きく
							textAlign="center"
							w="full"
							whiteSpace="pre-line"
							isTruncated={false}
						>
							{description}
						</Text>
					</Box>

					{/* 右: 次へボタン */}
					<Box
						flex="0 0 auto"
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
					>
						{showNext ? (
							isLastStep ? (
								<>
									{/* モバイルはアイコンのみ、md以上は「始める」+アイコン */}
									<Button
										rightIcon={<FaRocket size={28} />}
										colorScheme="purple"
										bgGradient="linear(135deg, purple.500 0%, blue.500 50%, teal.500 100%)"
										variant="solid"
										size="lg"
										onClick={onNext}
										borderRadius="full"
										px={6}
										py={6}
										shadow="xl"
										fontWeight="bold"
										fontSize="lg"
										_hover={{
											bgGradient:
												"linear(135deg, purple.600 0%, blue.600 50%, teal.600 100%)",
											transform: "translateY(-2px)",
											shadow: "2xl",
										}}
										display={{ base: "none", md: "inline-flex" }}
									>
										始める
									</Button>
									<IconButton
										aria-label="始める"
										icon={<FaRocket size={28} />}
										colorScheme="purple"
										bgGradient="linear(135deg, purple.500 0%, blue.500 50%, teal.500 100%)"
										variant="solid"
										size="lg"
										onClick={onNext}
										borderRadius="full"
										shadow="xl"
										_hover={{
											bgGradient:
												"linear(135deg, purple.600 0%, blue.600 50%, teal.600 100%)",
											transform: "translateY(-2px)",
											shadow: "2xl",
										}}
										display={{ base: "inline-flex", md: "none" }}
									/>
								</>
							) : (
								<Circle
									size={{ base: "54px", md: "62px" }}
									bg="whiteAlpha.300"
									border="2px solid"
									boxShadow="0 0 0 4px rgba(128,90,213,0.15)"
									_hover={{ bg: "whiteAlpha.500" }}
									transition="background 0.2s"
									display="flex"
									alignItems="center"
									justifyContent="center"
								>
									<IconButton
										variant="ghost"
										colorScheme="whiteAlpha"
										aria-label="次へ"
										icon={<FaArrowRight size={28} />}
										onClick={onNext}
										borderRadius="full"
										boxSize={{ base: "44px", md: "50px" }}
										minW="unset"
										p={0}
										bg="transparent"
										_hover={{
											bg: "transparent",
											transform: "translateY(-2px) scale(1.08)",
											shadow: "md",
										}}
									/>
								</Circle>
							)
						) : (
							<Box boxSize={{ base: "54px", md: "62px" }} />
						)}
					</Box>
				</Flex>
			</CardHeader>

			{/* カードボディ */}
			<CardBody p={{ base: 4, md: 10 }}>{children}</CardBody>
		</MotionCard>
	);
};
