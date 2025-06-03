import {
	Box,
	Circle,
	HStack,
	Text,
	VStack,
	useBreakpointValue,
	useColorModeValue,
	keyframes,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type React from "react";

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);

interface TutorialProgressBarProps {
	currentStep: number;
	totalSteps: number;
	stepTitles?: string[];
	size?: "sm" | "md" | "lg";
	orientation?: "horizontal" | "vertical";
	showLabels?: boolean;
	animated?: boolean;
}

// 高度なキーフレームアニメーション
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.8); }
`;

/**
 * 最高級の洗練されたチュートリアル専用プログレスバー
 * 高度なアニメーション・エフェクト付きステップインジケーター
 */
export const TutorialProgressBar: React.FC<TutorialProgressBarProps> = ({
	currentStep,
	totalSteps,
	stepTitles = [],
	size = "md",
	orientation = "horizontal",
	showLabels = true,
	animated = true,
}) => {
	// レスポンシブ対応
	const isVertical = orientation === "vertical";
	const responsiveOrientation = useBreakpointValue({
		base: "vertical",
		md: orientation,
	});
	const isResponsiveVertical = responsiveOrientation === "vertical";

	// 高級カラーテーマ
	const bgGradient = useColorModeValue(
		"linear(135deg, #667eea 0%, #764ba2 25%, #667eea 50%, #f093fb 75%, #f5576c 100%)",
		"linear(135deg, #667eea 0%, #764ba2 25%, #667eea 50%, #f093fb 75%, #f5576c 100%)",
	);
	const completedGradient = useColorModeValue(
		"linear(135deg, #11998e 0%, #38ef7d 50%, #11998e 100%)",
		"linear(135deg, #11998e 0%, #38ef7d 50%, #11998e 100%)",
	);
	const pendingGradient = useColorModeValue(
		"linear(135deg, #e0e7ff 0%, #c7d2fe 100%)",
		"linear(135deg, #4c5e77 0%, #5a6c84 100%)",
	);
	const activeGlow = useColorModeValue(
		"0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(139, 92, 246, 0.4)",
		"0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(139, 92, 246, 0.4)",
	);

	// プレミアムサイズ設定
	const sizeConfig = {
		sm: {
			circleSize: "48px",
			fontSize: "sm",
			lineThickness: "4px",
			spacing: 5,
			glowSize: "6px",
		},
		md: {
			circleSize: "64px",
			fontSize: "md",
			lineThickness: "6px",
			spacing: 8,
			glowSize: "8px",
		},
		lg: {
			circleSize: "80px",
			fontSize: "lg",
			lineThickness: "8px",
			spacing: 10,
			glowSize: "10px",
		},
	};

	const config = sizeConfig[size];

	// 高度なアニメーション設定
	const circleVariants = {
		inactive: {
			scale: 1,
			boxShadow: "0 0 0px rgba(139, 92, 246, 0)",
			filter: "brightness(0.8)",
		},
		active: {
			scale: [1, 1.15, 1],
			boxShadow: [
				"0 0 20px rgba(139, 92, 246, 0.6)",
				"0 0 60px rgba(139, 92, 246, 0.9), 0 0 100px rgba(139, 92, 246, 0.4)",
				"0 0 20px rgba(139, 92, 246, 0.6)",
			],
			filter: "brightness(1.2)",
			transition: {
				duration: 2,
				repeat: Number.POSITIVE_INFINITY,
				ease: "easeInOut",
			},
		},
		completed: {
			scale: 1,
			boxShadow: [
				"0 0 25px rgba(17, 153, 142, 0.6)",
				"0 0 35px rgba(17, 153, 142, 0.8)",
				"0 0 25px rgba(17, 153, 142, 0.6)",
			],
			filter: "brightness(1.1)",
			transition: {
				duration: 1.5,
				repeat: Number.POSITIVE_INFINITY,
				ease: "easeInOut",
			},
		},
	};

	const lineVariants = {
		inactive: { 
			scaleX: 0, 
			opacity: 0.4,
			background: pendingGradient,
		},
		completed: { 
			scaleX: 1, 
			opacity: 1,
			background: completedGradient,
			transition: {
				scaleX: { duration: 1.2, ease: "easeOut" },
				opacity: { duration: 0.8 },
			},
		},
	};

	const sparkleVariants = {
		animate: {
			scale: [0, 1.5, 0],
			opacity: [0, 1, 0],
			rotate: [0, 180, 360],
			transition: {
				duration: 2,
				repeat: Number.POSITIVE_INFINITY,
				ease: "easeInOut",
				delay: Math.random() * 2,
			},
		},
	};

	// ステップの状態を判定
	const getStepStatus = (stepIndex: number) => {
		if (stepIndex < currentStep) return "completed";
		if (stepIndex === currentStep) return "active";
		return "inactive";
	};

	// ステップのカラーを取得
	const getStepColor = (stepIndex: number) => {
		const status = getStepStatus(stepIndex);
		if (status === "completed") return completedGradient;
		if (status === "active") return bgGradient;
		return pendingGradient;
	};

	// プログレス計算
	const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

	return (
		<VStack spacing={6} w="full">
			{/* メインプログレスバー */}
			<Box
				w="full"
				maxW="600px"
				mx="auto"
				position="relative"
				p={4}
			>
				{/* 背景ライン */}
				<Box
					position="absolute"
					top="50%"
					left="0"
					right="0"
					h={config.lineThickness}
					bg={pendingColor}
					borderRadius="full"
					transform="translateY(-50%)"
					zIndex="1"
				/>

				{/* アクティブライン */}
				<MotionBox
					position="absolute"
					top="50%"
					left="0"
					h={config.lineThickness}
					bgGradient={bgGradient}
					borderRadius="full"
					transform="translateY(-50%)"
					zIndex="2"
					initial={{ width: "0%" }}
					animate={{ width: `${progressPercentage}%` }}
					transition={{ duration: 1, ease: "easeOut" }}
				/>

				{/* ステップサークル */}
				<HStack justify="space-between" position="relative" zIndex="3">
					{Array.from({ length: totalSteps }, (_, index) => {
						const status = getStepStatus(index);
						const isCompleted = status === "completed";
						const isActive = status === "active";

						return (
							<VStack key={index} spacing={2} align="center">
								<MotionCircle
									size={config.circleSize}
									bgGradient={getStepColor(index)}
									color="white"
									fontWeight="bold"
									fontSize={config.fontSize}
									shadow="lg"
									border="3px solid white"
									variants={animated ? circleVariants : undefined}
									animate={animated ? status : undefined}
									initial={animated ? "inactive" : undefined}
									whileHover={{ scale: 1.05 }}
									cursor="pointer"
									position="relative"
								>
									{isCompleted ? (
										<MotionBox
											initial={{ scale: 0, rotate: -180 }}
											animate={{ scale: 1, rotate: 0 }}
											transition={{ duration: 0.5, delay: 0.2 }}
										>
											✓
										</MotionBox>
									) : (
										<MotionBox
											initial={animated ? { scale: 0 } : undefined}
											animate={{ scale: 1 }}
											transition={{ duration: 0.3, delay: index * 0.1 }}
										>
											{index + 1}
										</MotionBox>
									)}

									{/* アクティブリング */}
									{isActive && (
										<MotionBox
											position="absolute"
											inset="-6px"
											border="2px solid"
											borderColor="purple.300"
											borderRadius="full"
											animate={{
												scale: [1, 1.2, 1],
												opacity: [0.7, 0.3, 0.7],
											}}
											transition={{
												duration: 2,
												repeat: Number.POSITIVE_INFINITY,
												ease: "easeInOut",
											}}
										/>
									)}
								</MotionCircle>

								{/* ステップラベル */}
								{showLabels && stepTitles[index] && (
									<MotionBox
										initial={animated ? { opacity: 0, y: 10 } : undefined}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
									>
										<Text
											fontSize="xs"
											fontWeight="medium"
											color={isActive ? "purple.600" : "gray.500"}
											textAlign="center"
											maxW="80px"
											noOfLines={2}
										>
											{stepTitles[index]}
										</Text>
									</MotionBox>
								)}
							</VStack>
						);
					})}
				</HStack>
			</Box>

			{/* 詳細情報 */}
			<MotionBox
				initial={animated ? { opacity: 0, y: 20 } : undefined}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
				textAlign="center"
			>
				<VStack spacing={2}>
					<HStack spacing={2} align="center">
						<Text fontSize="lg" fontWeight="bold" color="gray.700">
							ステップ {currentStep + 1}
						</Text>
						<Text fontSize="md" color="gray.500">
							/ {totalSteps}
						</Text>
					</HStack>

					{/* パーセンテージ表示 */}
					<MotionBox
						initial={animated ? { scale: 0 } : undefined}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, delay: 0.7 }}
					>
						<Text
							fontSize="2xl"
							fontWeight="black"
							bgGradient={bgGradient}
							bgClip="text"
						>
							{Math.round(progressPercentage)}%
						</Text>
					</MotionBox>

					{/* サブプログレスバー */}
					<Box w="200px" bg="gray.100" h="8px" borderRadius="full" overflow="hidden">
						<MotionBox
							h="full"
							bgGradient={bgGradient}
							borderRadius="full"
							initial={{ width: "0%" }}
							animate={{ width: `${progressPercentage}%` }}
							transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
							position="relative"
						>
							{/* プログレスバーのシャイン効果 */}
							<MotionBox
								position="absolute"
								top="0"
								left="-100%"
								w="100%"
								h="full"
								bg="linear-gradient(90deg, transparent, white, transparent)"
								opacity="0.3"
								animate={{
									left: ["100%", "200%"],
								}}
								transition={{
									duration: 2,
									repeat: Number.POSITIVE_INFINITY,
									ease: "easeInOut",
								}}
							/>
						</MotionBox>
					</Box>
				</VStack>
			</MotionBox>
		</VStack>
	);
};