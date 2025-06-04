import {
	Box,
	Card,
	CardBody,
	CardHeader,
	Circle,
	HStack,
	Heading,
	Icon,
	Text,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type React from "react";
import type { IconType } from "react-icons";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface TutorialStepCardProps {
	title: string;
	description: string;
	icon: IconType;
	color: string;
	gradient: string;
	isActive?: boolean;
	children: React.ReactNode;
	minHeight?: string;
}

/**
 * チュートリアルステップカード分子コンポーネント
 * 各ステップの内容を表示する美しいカード
 */
export const TutorialStepCard: React.FC<TutorialStepCardProps> = ({
	title,
	description,
	icon,
	gradient,
	isActive = false,
	children,
	minHeight = "700px",
}) => {
	const cardBg = useColorModeValue("whiteAlpha.200", "gray.800");

	const floatingAnimation = {
		animate: {
			y: [-2, 2, -2],
			transition: {
				duration: 3,
				repeat: Number.POSITIVE_INFINITY,
				ease: "easeInOut",
			},
		},
	};

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
				py={8}
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
				<HStack spacing={6} position="relative" zIndex="2">
					<MotionBox {...floatingAnimation}>
						<Circle size="80px" bg="whiteAlpha.300" shadow="xl">
							<Icon as={icon} boxSize={10} />
						</Circle>
					</MotionBox>
					<VStack align="start" spacing={2}>
						<Heading size="2xl" textShadow="lg">
							{title}
						</Heading>
						<Text opacity="0.95" fontSize="lg">
							{description}
						</Text>
					</VStack>
				</HStack>

				{/* アクティブインジケーター */}
				{isActive && (
					<MotionBox
						position="absolute"
						bottom="0"
						left="0"
						right="0"
						height="4px"
						bg="white"
						opacity="0.8"
						animate={{
							scaleX: [0, 1, 0],
						}}
						transition={{
							duration: 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
					/>
				)}
			</CardHeader>

			{/* カードボディ */}
			<CardBody p={10}>{children}</CardBody>
		</MotionCard>
	);
};
