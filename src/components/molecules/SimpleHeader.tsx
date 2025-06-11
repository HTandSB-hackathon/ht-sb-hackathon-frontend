import {
	Box,
	Button,
	Heading,
	Text,
	VStack,
	useBreakpointValue,
	useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router";

interface SimpleHeaderProps {
	title?: string;
	subtitle?: string;
	navigateTo: string;
	navigateLavel: string;
}

const MotionBox = motion(Box);

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
	title = "",
	subtitle = "",
	navigateTo,
	navigateLavel,
}) => {
	const navigate = useNavigate();
	const headerSize = useBreakpointValue({ base: "xl", md: "2xl", lg: "3xl" });
	const headerBg = useColorModeValue(
		"rgba(255, 255, 255, 0.8)",
		"rgba(26, 32, 44, 0.8)",
	);

	return (
		<MotionBox
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
		>
			<Box
				bg={headerBg}
				backdropFilter="blur(20px)"
				borderRadius="2xl"
				p={6}
				border="1px solid"
				borderColor="whiteAlpha.200"
				shadow="xl"
				position="relative"
			>
				{/* Homeへ戻るボタン*/}
				<Box
					position="absolute"
					left="6"
					top="50%"
					transform="translateY(-50%)"
					zIndex={2}
				>
					{/* スマホ時はアイコンボタン、md以上はテキストボタン */}
					<Button
						display={{ base: "none", md: "inline-flex" }}
						leftIcon={<FaArrowRight style={{ transform: "scaleX(-1)" }} />}
						variant="ghost"
						onClick={() => navigate(navigateTo)}
						borderRadius="xl"
						_hover={{ bg: "whiteAlpha.200" }}
						size="sm"
					>
						{navigateLavel}
					</Button>
					<Button
						display={{ base: "inline-flex", md: "none" }}
						variant="ghost"
						onClick={() => navigate(navigateTo)}
						borderRadius="full"
						_hover={{ bg: "whiteAlpha.200" }}
						size="sm"
						p={2}
						minW="auto"
					>
						<FaArrowRight style={{ transform: "scaleX(-1)" }} />
					</Button>
				</Box>
				<VStack spacing={4} textAlign="center">
					<Heading
						size={headerSize}
						bgGradient="linear(to-r, purple.600, blue.600, teal.500)"
						bgClip="text"
						fontWeight="extrabold"
						lineHeight={1.2}
						fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "5xl" }}
					>
						{title}
					</Heading>
					<Text
						fontSize={{ base: "md", md: "lg" }}
						color="gray.600"
						maxW="2xl"
						lineHeight="tall"
					>
						{subtitle}
					</Text>
				</VStack>
			</Box>
		</MotionBox>
	);
};
