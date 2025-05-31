import { Box, Button, Heading } from "@chakra-ui/react";
import type React from "react";

import Header from "@/components/organisms/Header";

const CharacterPage: React.FC = () => {
	const handleChat = () => {
		return;
	};

	return (
		<Box>
			<Header />
			<Box textAlign="center" py={10} px={6}>
				<Heading as="h1" size="2xl" mb={4}>
					各会話
				</Heading>
				<Button colorScheme="teal" onClick={handleChat}>
					チャットする
				</Button>
			</Box>
		</Box>
	);
};

export default CharacterPage;
