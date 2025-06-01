import GitHubLoginButton from "@/components/atoms/GitHubLoginButton";
import LoginForm from "@/components/atoms/LoginForm";
import {
	Box,
	Divider,
	Text,
	VStack,
	Link,
	Card,
	CardBody,
	useColorModeValue,
	HStack,
	Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function LoginPage() {
	const navigate = useNavigate();

	// カラーテーマ
	const cardBg = useColorModeValue("white", "gray.800");

	return (
		<Box maxW="md" mx="auto">
			<VStack spacing={6}>
				{/* メインログインフォーム */}
				<LoginForm />

				{/* ソーシャルログイン */}
				<MotionCard
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					bg={cardBg}
					borderRadius="2xl"
					shadow="lg"
					border="1px solid"
					borderColor="gray.200"
					w="full"
					maxW="md"
				>
					<CardBody p={6}>
						<VStack spacing={4}>
							<Text
								textAlign="center"
								color="gray.500"
								fontSize="sm"
								fontWeight="medium"
							>
								または、ソーシャルアカウントでログイン
							</Text>

							<Divider />

							<GitHubLoginButton />
						</VStack>
					</CardBody>
				</MotionCard>

				{/* 新規登録リンク */}
				<MotionBox
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					textAlign="center"
					p={4}
				>
					<Text fontSize="sm" color="gray.500">
						初めての方ですか？{" "}
						<Link
							color="purple.500"
							fontWeight="bold"
							onClick={() => navigate("/register")}
							_hover={{
								textDecoration: "underline",
								color: "purple.600",
							}}
						>
							新規登録はこちら
						</Link>
					</Text>

					<HStack justify="center" mt={3} spacing={1}>
						<Icon as={FaHeart} color="red.400" boxSize={3} />
						<Text fontSize="xs" color="gray.400">
							福島のこころで素敵な出会いを
						</Text>
						<Icon as={FaHeart} color="red.400" boxSize={3} />
					</HStack>
				</MotionBox>
			</VStack>
		</Box>
	);
}
