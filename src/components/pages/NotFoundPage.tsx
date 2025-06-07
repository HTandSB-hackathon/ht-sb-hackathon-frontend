import {
	Box,
	Button,
	Container,
	Heading,
	Text,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
	const navigate = useNavigate();
	const bgColor = useColorModeValue("gray.50", "gray.900");
	const textColor = useColorModeValue("gray.600", "gray.400");
	const headingColor = useColorModeValue("gray.700", "gray.200");

	return (
		<Box
			minH="100vh"
			bg={bgColor}
			display="flex"
			alignItems="center"
			justifyContent="center"
		>
			<Container maxW="lg" textAlign="center">
				<VStack spacing={8}>
					<VStack spacing={4}>
						<Heading as="h1" size="4xl" color="blue.500" fontWeight="bold">
							404
						</Heading>
						<Heading
							as="h2"
							size="xl"
							color={headingColor}
							fontWeight="semibold"
						>
							ページが見つかりません
						</Heading>
						<Text fontSize="lg" color={textColor} maxW="md" lineHeight="tall">
							お探しのページは存在しないか、移動された可能性があります。
							<br />
							URLを確認してもう一度お試しください。
						</Text>
					</VStack>

					<VStack spacing={4}>
						<Button
							colorScheme="blue"
							size="lg"
							onClick={() => navigate("/")}
							px={8}
						>
							ホームに戻る
						</Button>
						<Button
							variant="ghost"
							size="md"
							onClick={() => navigate(-1)}
							color={textColor}
						>
							前のページに戻る
						</Button>
					</VStack>
				</VStack>
			</Container>
		</Box>
	);
};

export default NotFoundPage;
