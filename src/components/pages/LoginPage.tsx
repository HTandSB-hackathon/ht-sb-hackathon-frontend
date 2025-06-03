import LoginBox from "@/components/organisms/LoginBox";
import {
	Box,
	Container,
	useBreakpointValue,
	useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function LoginPage() {
	// カラーテーマ
	const bgGradient = useColorModeValue(
		"linear(to-br, purple.50, blue.50, teal.50)",
		"linear(to-br, gray.900, purple.900, blue.900)",
	);

	// レスポンシブデザイン
	const containerMaxW = useBreakpointValue({
		base: "full",
		sm: "md",
		md: "lg",
		lg: "xl",
	});

	return (
		<Box
			minH="100vh"
			bgGradient={bgGradient}
			position="relative"
			overflow={{ base: "auto", md: "hidden" }} // md以上でスクロールバー非表示
		>
			{/* 背景装飾 */}
			<Box position="absolute" inset="0" overflow="hidden" pointerEvents="none">
				<MotionBox
					position="absolute"
					top="-10%"
					right="-10%"
					width="30%"
					height="30%"
					bgGradient="radial(circle, purple.200 0%, transparent 70%)"
					opacity="0.4"
					animate={{
						rotate: [0, 360],
						scale: [1, 1.1, 1],
					}}
					transition={{
						duration: 25,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
				<MotionBox
					position="absolute"
					bottom="-10%"
					left="-10%"
					width="40%"
					height="40%"
					bgGradient="radial(circle, blue.200 0%, transparent 70%)"
					opacity="0.3"
					animate={{
						rotate: [360, 0],
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
					top="20%"
					left="20%"
					width="20%"
					height="20%"
					bgGradient="radial(circle, teal.200 0%, transparent 70%)"
					opacity="0.2"
					animate={{
						rotate: [0, -360],
						scale: [1, 1.15, 1],
					}}
					transition={{
						duration: 35,
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
				minH={{ base: "auto", md: "100vh" }} // md以上で中央寄せ
				px={{ base: 4, sm: 6 }} // モバイルで余白
				pt={{ base: 16, md: 0 }} // スマホ時は上に余白
			>
				<MotionBox
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					w="full"
					maxW="md"
				>
					<LoginBox />
				</MotionBox>
			</Container>
		</Box>
	);
}
