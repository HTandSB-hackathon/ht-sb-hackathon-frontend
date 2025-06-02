import { Box, Button, Heading } from "@chakra-ui/react";
import type React from "react";
import { useNavigate } from "react-router";

import Header from "@/components/organisms/Header";

const HomePage: React.FC = () => {
	const navigate = useNavigate();

	const handleCharactersRedirect = () => {
		navigate("/characters");
	};

	return (
		<Box>
			<Header />
			<Box textAlign="center" py={10} px={6}>
				<Heading as="h1" size="2xl" mb={4}>
					ホーム画面
				</Heading>
				<Button colorScheme="blue" onClick={handleCharactersRedirect}>
					キャラクター画面一覧へ
				</Button>
			</Box>
		</Box>
	);
};

export default HomePage;
